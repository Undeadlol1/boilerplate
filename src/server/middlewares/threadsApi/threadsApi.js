import slugify from 'slug'
import { Router } from 'express'
import { Threads, User } from 'server/data/models'
import validations from './threadsApi.validations'
import { createPagination } from '../../services/utils'
import { mustLogin } from 'server/services/permissions'
import { handleValidationErrors } from '../../services/errors'
import { matchedData, sanitize } from 'express-validator/filter'

const limit = 12
const debug = require('debug-logger')('threadsApi')

/**
 * Get paginated threads by parentId
 * @param {String} parentId parent UUID
 * @param {Number} [currentPage=1] page number
 * @export
 */
export async function getThreads(parentId, currentPage=1) {
  return await createPagination({
    limit,
    model: Threads,
    page: currentPage,
    where: {parentId},
  })
}

export default Router()
  /*
    Get single thread by slug.
  */
  .get('/thread/:slug',
    // validations
    validations.getOne,
    // handle validation errors
    handleValidationErrors,
    async (req, res) => {
      try {
        const params = matchedData(req)
        const thread = await Threads.findOne({
          raw: true,
          nest: true,
          include: [User],
          where: { slug: params.slug },
        })
        res.json(thread)
      } catch (error) {
        console.log(error)
        res.status(500).end(error.message)
      }
  })
  /*
    Get threads by parentId.
    Response with paginated results.
  */
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
  /*
    Update thread.
  */
  .put('/:threadsId',
    // permissions
    mustLogin,
    // sanitising
    sanitize(['threadsId', 'text']).trim(),
    // validations
    validations.put,
    // handle validation errors
    handleValidationErrors,
    // handle route
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
  .post('/',
    // permissions
    mustLogin,
    // sanitising
    sanitize(['parentId', 'name', 'text']).trim(),
    // validations
    validations.post,
    // handle errors
    handleValidationErrors,
    // handle route
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