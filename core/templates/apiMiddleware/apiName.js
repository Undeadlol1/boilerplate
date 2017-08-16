import { mustLogin } from 'server/services/permissions'
import { Mood } from 'server/data/models'
import express from 'express'
import slugify from 'slug'

// routes
const router = express.Router()
const limit = 12

router

  // get all apiNames for index page
  .get('/:page?', async (req, res) => { // TODO make sure pagination works right
    try {
      const page = req.params.page
      const offset = page ? limit * (page -1) : 0
      const totalMoods = await Mood.count()
      const totalPages = Math.ceil(totalMoods / limit)
      const apiNames = await Mood.findAll({
        limit,
        offset,
        order: 'rand()',
        // add preview image
        include: [{
          limit: 1,
          model: Node,
          order: 'rand()',
        }]
      })
      res.json({ apiNames, totalPages })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single apiName by slug or name
  .get('/apiName/:slug?', async ({params, query}, res) => {
    try {
      const slug = params.slug
      const name = query.name
      const apiName = await Mood.findOne({
        where: {
          $or: [{slug}, {name}]
        }
      })
      res.json(apiName)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // search for apiName
  .get('/search/:name/:page?', async (req, res) => { // TODO make sure pagination works right
    try {
      const { page, name } = req.params
      if (!name) return res.boom.badRequest('invalid query')
      const offset = page ? limit * (page -1) : 0
      const where = {
                      name: { $like: '%' + name + '%' }
                    }
      const totalMoods = await Mood.count({ where })
      const totalPages = Math.round(totalMoods / limit)
      const apiNames = await Mood.findAll({
        limit,
        offset,
        where,
      }) || []
      res.json({ apiNames, totalPages })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // create apiName
  .post('/', mustLogin, async ({user, body: { name }}, res) => {
    try {
      const UserId = user.id
      const slug = slugify(name)
      const apiName = await Mood.create({ UserId, name, slug }) // TODO move this in model definition?
      res.json(apiName)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // create apiName
  .post('/', mustLogin, async ({user, body: { name }}, res) => {
    try {
      const UserId = user.id
      const slug = slugify(name)
      const apiName = await Mood.create({ UserId, name, slug }) // TODO move this in model definition?
      res.json(apiName)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

export default router