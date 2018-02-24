import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Forums } from 'server/data/models'
import { getThreads } from 'server/middlewares/threadsApi'
import { mustLogin, isAdmin } from 'server/services/permissions'
import { matchedData, sanitize } from 'express-validator/filter'
import { check, validationResult } from 'express-validator/check'

const limit = 12

export default Router()

  // get all forums
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page,
            totalForumss = await Forums.count(),
            offset = page ? limit * (page -1) : 0,
            totalPages = Math.ceil(totalForumss / limit),
            values = await Forums.findAll({limit, offset})
      res.json({ values, totalPages, currentPage: page || 1 })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single forum
  .get('/forum/:slug', async ({params}, res) => {
    try {
      const forum = await Forums.findOne({
        where: { slug: params.slug }
      })
      forum.dataValues.threads = await getThreads(forum.id)
      res.json(forum)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // update forum
  .put('/:forumsId', isAdmin, async ({user, body, params}, res) => {
    try {
      const UserId = user.id
      const forum = await Forums.findById(params.forumsId)

      // TODO: what if there is no forum?

      // check permissions
      if (Forums.UserId != UserId) return res.status(401).end()
      else res.json(await forum.update(body))

    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // create forum
  .post('/',
    isAdmin,
    // check('name', ),
    async ({user, body}, res) => {
      try {
        const UserId = user.id
        const slug = slugify(body.name)
        const forum = await Forums.create({...body, slug, UserId})
        res.json(forum)
      } catch (error) {
        console.log(error)
        res.status(500).end(error)
      }
  })