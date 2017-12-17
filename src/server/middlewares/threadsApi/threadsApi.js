import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Threads, User } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

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
      // const page = req.params.page,
      //       totalThreads = await Threads.count(),
      //       offset = page ? limit * (page -1) : 0,
      //       totalPages = Math.ceil(totalThreads / limit),
      //       threads = await Threads.findAll({limit, offset})
      const response = await getThreads(params.parentId, params.page)
      res.json(response)
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