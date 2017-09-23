import slugify from 'slug'
import { Router } from 'express'
import { Plural } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

const limit = 12

export default Router()

  // get all plural
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page
      const offset = page ? limit * (page -1) : 0
      const totalApiNames = await Plural.count()
      const totalPages = Math.ceil(totalApiNames / limit)
      const plural = await Plural.findAll({
        limit,
        offset,
      })
      res.json({ plural, totalPages })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single singular
  .get('/singular/:apiNameId', async ({params}, res) => {
    try {
      const singular = await Plural.findById(params.apiNameId)
      res.json(singular)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // update singular
  .put('/:apiNameId', mustLogin, async ({user, body, params}, res) => {
    try {
      const UserId = user.id
      const singular = await Plural.findById(params.apiNameId)

      // check permissions
      if (Plural.UserId != UserId) return res.status(401).end()
      else res.json(await singular.update(body))

    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // create singular
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      const singular = await Plural.create({...body, UserId})
      res.json(singular)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })