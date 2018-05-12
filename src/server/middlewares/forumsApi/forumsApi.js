import slugify from 'slug'
import { Router } from 'express'
import logger from 'debug-logger'
import generateUuid from 'uuid/v4'
import { Forums } from 'server/data/models'
import asyncHandler from 'express-async-handler'
import { createPagination } from '../../services/utils'
import { getThreads } from 'server/middlewares/threadsApi'
import { mustLogin, isAdmin } from 'server/services/permissions'
import { matchedData, sanitize } from 'express-validator/filter'
import { check, validationResult } from 'express-validator/check'

const limit = 12
const debug = logger('forumsApi')

export default Router()
  /**
   * Get all forums.
   * This endpoint returns paginated data of all created forums.
   */
  .get('/:page?', asyncHandler(async (req, res) => {
    res.json(
      await createPagination({
        limit,
        model: Forums,
        page: req.params.page,
      })
    )
  }))
  /**
   * Get single forum.
   */
  .get('/forum/:slug', asyncHandler(async ({params}, res) => {
    const forum = await Forums.findOne({
      where: { slug: params.slug },
    })
    forum.dataValues.threads = await getThreads(forum.id)
    res.json(forum)
  }))
  /**
   * Update forum.
   */
  .put(
    '/:forumsId',
    isAdmin,
    asyncHandler(async ({user, body, params}, res) => {
      const UserId = user.id
      const forum = await Forums.findById(params.forumsId)

      // TODO: what if there is no forum?

      // check permissions
      if (Forums.UserId != UserId) return res.status(401).end()
      else res.json(await forum.update(body))
  }))
  /**
   * Create forum.
   */
  .post('/',
    isAdmin,
    // check('name', ),
    asyncHandler(async ({user, body}, res) => {
      // Debug logging.
      debug('user', user)
      debug('body', body)
      res.json(
        await Forums.create({
          ...body,
          UserId: user.id,
          slug: slugify(body.name),
        })
      )
  }))