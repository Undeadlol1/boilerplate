import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Threads, User } from 'server/data/models'
import validations from './threadsApi.validations'
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
    validations.getOne,
    // handle validation errors
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
    validations.get,
    // handle validation errors
    handleValidationErrors,
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
    validations.put,
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
    Create thread.
  */
  //  FIXME: add tests which dissalow creating of
  .post('/',
    // permissions
    mustLogin,
    // sanitising
    sanitize(['parentId', 'name', 'text']).trim(),
    // validations
    validations.post,
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