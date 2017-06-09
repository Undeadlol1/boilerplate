import { mustLogin } from '../services/permissions'
import { Mood, Node } from '../data/models'
import express from 'express'
import slugify from 'slug'

// routes
const router = express.Router(); // TODO refactor without "const"?
const limit = 12

router
  // get all moods for index page
  .get('/:page?', async (req, res) => { // TODO make sure pagination works right
    try {
      const page = req.params.page
      const offset = page ? limit * (page -1) : 0
      const totalMoods = await Mood.count()
      const totalPages = Math.round(totalMoods / limit) 
      const moods = await Mood.findAll({
        limit,
        offset,
        include: [{ model: Node, limit: 1 }] // for preview image
      })
      res.json({ moods, totalPages })
    }
    catch (error) {
      console.log(error);
      res.boom.internal(error)
    }
  })
  
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
      const moods = await Mood.findAll({
        limit,
        offset,
        where,
        include: [{ model: Node, limit: 1 }] // for preview image
      }) || []
      res.json({ moods, totalPages })
    }
    catch (error) {
      console.log(error);
      res.boom.internal(error)
    }
  })

  // create mood
  .post('/', mustLogin, async ({user: { id: UserId }, body: { name }}, res) => {
    try {
      const slug = slugify(name)
      const mood = await Mood.create({ UserId, name, slug }) // TODO move this in model definition?
      res.json(mood)
    } catch (error) {
      console.log(error)
      res.boom.internal(error)
    }
  })

  // get single mood by slug
  .get('/mood/:slug', function({ params }, res) {
    Mood
    .findOne({ where: { slug: params.slug} })
    .then(result => res.json(result))
    .catch(error => res.boom.internal(error))
  })

export default router