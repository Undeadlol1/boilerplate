import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Threads, User } from 'server/data/models'
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
    const totalThreads = await Threads.count({where: {parentId}}),
          offset = currentPage ? limit * (currentPage -1) : 0
    return {
      currentPage,
      totalPages: Math.ceil(totalThreads / limit) || 1,
      values: await Threads.findAll({limit, offset, where: {parentId}}),
    }
}

export default Router()

  // get single thread
  .get('/thread/:slug', async ({params}, res) => {
    try {
      const thread = await Threads.findOne({
                        include: [User],
                        where: { slug: params.slug },
                      })
      res.json(thread)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })


  // get all threads
  .get('/:parentId/:page?', async ({params}, res) => {
    try {
      res.json(
        await getThreads(params.parentId, params.page)
      )
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // update thread
  .put('/:threadsId', mustLogin, async ({user, body, params}, res) => {
    try {
      const UserId = user.id
      const thread = await Threads.findById(params.threadsId)

      // check permissions
      if (Threads.UserId != UserId) return res.status(401).end()
      else res.json(await thread.update(body))

    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // Create thread.
  .post('/',
    /* PERMISSIONS */
    mustLogin,
    /* VALIDATIONS */
    // [
    //   check('parentId', 'parentId is required').trim().exists().isUUID(),
    //   check('text', 'text is required').trim().exists().isLength({min: 5}),
    //   check('name').trim().exists().isLength({min: 5, max: 100}).withMessage('name is required'),
    // ],
    checkSchema({
      parentId: {
        trim: true,
        isUUID: true,
        errorMessage: 'Parent id is required',
      },
      name: {
        exists: true,
        errorMessage: 'Name is required',
        trim: true,
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
          errorMessage: 'Text should be at least 5 chars long',
        }
      },
    }),
    /* HANDLE VALIDATION ERRORS */
    (req, res, next) => {
      // Get the validation result whenever you want; see the Validation Result API for all options!
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() })
      }
      else next()
    },
    async (req, res) => {
      try {
        res.json(
          await Threads.create({
            ...matchedData(req),
            UserId: req.user.id,
            slug: slugify(req.body.name),
          })
        )
      }
      catch (error) {
        console.log(error)
        res.status(500).end(error)
      }
  })