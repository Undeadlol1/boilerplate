import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Threads, User } from 'server/data/models'
import { createPagination } from '../../services/utils'
import { mustLogin } from 'server/services/permissions'
import { matchedData, sanitize } from 'express-validator/filter'
import { check, validationResult, checkSchema } from 'express-validator/check'

const limit = 12

/**
 *
 * @param {String} parentId parent UUID
 * @param {Number} [currentPage=1] page number
 */
export async function getThreads(parentId, currentPage=1) {
  return await createPagination({
    limit: 12,
    model: Threads,
    page: currentPage,
    where: {parentId},
  })
}

const handleValidationErrors = (req, res, next) => {
  // Get the validation result whenever you want; see the Validation Result API for all options!
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() })
  }
  else next()
}

export default Router()
  /**
   * get single thread
   */
  .get('/thread/:slug',
    // validations
    checkSchema({
      slug: {
        trim: true,
        exists: true,
        errorMessage: 'Is required', // FIXME: tests
      }
    }),
    handleValidationErrors,
    async (req, res) => {
      try {
        res.json(
          await Threads.findOne({
            include: [User],
            where: { slug: matchedData(req).slug },
          })
        )
      } catch (error) {
        console.log(error)
        res.status(500).end(error)
      }
  })
  // get all threads
  .get('/:parentId/:page?',
    // sanitising
    sanitize(['parentId', 'page']).trim(),
    // validations
    checkSchema({
      parentId: {
        exists: true,
        errorMessage: 'Is required', // FIXME: tests
      },
      // FIXME: tests
      page: {
        isInt: true,
        toInt: true, // is this working?ß
        optional: true,
        errorMessage: 'Is required',
      }
    }),
    async (req, res) => {
      try {
        const params = matchedData(req)
        // TODO: user proper params
        res.json(
          await getThreads(params.parentId, params.page)
        )
      }
      catch (error) {
        console.log(error);
        res.status(500).end(error)
      }
  })
  // Update thread.
  .put('/:threadsId',
    mustLogin,
    // FIXME: tests
    // FIXME: updatable fields
    // FIXME: make sure no other field is updated
    sanitize(['threadsId', 'text']).trim(),
    checkSchema({
      // Params validation.
      threadsId: {
        trim: true,
        exists: true,
        isUUID: true,
        errorMessage: 'Is required',
        // TODO: tests
        // errorMessage: ''
      },
      // Body validation.
      // Every other field in body will be ignored.
      text: {
        trim: true,
        exists: true,
        errorMessage: 'Is required',
        isLength: {
          options: { min: 5 },
          errorMessage: 'Text should be atleast 5 characters long',
        }
      },
    }),
    handleValidationErrors,
    async (req, res) => {
      try {
        // TODO: validated data
        const UserId = req.user.id,
              bodyData = matchedData(req, { locations: ['body'] }),
              {threadsId} = matchedData(req, { locations: ['params'] }),
              thread = await Threads.findById(threadsId)
        // FIXME: add same checker to "apiName" template
        // FIXME: add tests about this one
        // NOTE: maybe should use customg validator?
        if (!thread) return res.status(204).end()
        // check permissions
        if (thread.UserId != UserId) res.status(403).end()
        else res.json(await thread.update(bodyData))

      } catch (error) {
        console.log(error)
        res.status(500).end(error)
      }
  })
  /*
    Creeate thread.
  */
  //  FIXME: add tests which dissalow creating of
  .post('/',
    // permissions
    mustLogin,
    // sanitising
    sanitize(['parentId', 'name', 'text']).trim(),
    // validations
    checkSchema({
      parentId: {
        exists: true,
        errorMessage: 'Parent id is required',
        isUUID: {
          errorMessage: 'Parent id is not valid UUID',
        },
      },
      name: {
        exists: true,
        errorMessage: 'Name is required',
        isLength: {
          options: { min: 5, max: 100 },
          errorMessage: 'Name must be between 5 and 100 characters long',
        },
      },
      text: {
        exists: true,
        errorMessage: 'Text is required',
        isLength: {
          options: { min: 5 },
          errorMessage: 'Text should be atleast 5 characters long',
        }
      },
    }),
    // handle errors
    handleValidationErrors,
    async (req, res) => {
      try {
        const payload = matchedData(req)
        res.json(
          await Threads.create({
            ...payload,
            UserId: req.user.id,
            slug: slugify(payload.name),
          })
        )
      }
      catch (error) {
        console.log(error)
        res.status(500).end(error)
      }
  })