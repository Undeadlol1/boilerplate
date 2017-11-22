import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Threads } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

const limit = 12

export default Router()

  // get all threads
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page,
            totalThreadss = await Threads.count(),
            offset = page ? limit * (page -1) : 0,
            totalPages = Math.ceil(totalThreadss / limit),
            threads = await Threads.findAll({limit, offset})
      res.json({ threads, totalPages })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single thread
  .get('/thread/:slug', async ({params}, res) => {
    try {
      const thread = await Threads.findOne({
                        where: { slug: params.slug }
                      })
      res.json(thread)
    } catch (error) {
      console.log(error)
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

  // create thread
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      const slug = slugify(body.name)
      const thread = await Threads.create({...body, slug, UserId})
      res.json(thread)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })