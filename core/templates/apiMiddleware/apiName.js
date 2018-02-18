import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Plural } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

const limit = 12

export default Router()

  // get all plural
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page,
            totalPlurals = await Plural.count(),
            offset = page ? limit * (page - 1) : 0,
            totalPages = Math.ceil(totalPlurals / limit),
            values = await Plural.findAll({limit, offset})
      res.json({ values, totalPages, currentPage: page || 1 })
    }
    catch (error) {
      res.status(500).end(error)
    }
  })

  // get single singular
  .get('/singular/:id', async ({params}, res) => {
    try {
      res.json(
        await Plural.findById(params.id)
      )
    } catch (error) {
      res.status(500).end(error)
    }
  })

  // update singular
  .put('/:singularId', mustLogin, async ({user, body, params}, res) => {
    try {
      const singular = await Plural.findById(params.singularId)
      if (!singular) return res.status(204).end()
      // check permissions
      if (singular.UserId != user.id) res.status(401).end()
      else res.json(await singular.update(body))

    } catch (error) {
      res.status(500).end(error)
    }
  })

  // create singular
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      res.json(
        await Plural.create({...body, UserId})
      )
    } catch (error) {
      res.status(500).end(error)
    }
  })

  // delete singular
  .delete('/:id', mustLogin, async ({user, body, params}, res) => {
    try {
      const singular = await Plural.findById(params.id)
      // document was not found
      if (!singular) return res.status(204).end()
      // user must be documents owner to delete it
      if (singular && singular.UserId == user.id) {
        await singular.destroy()
        await res.status(200).end()
      }
      else res.boom.unauthorized('You must be the owner to delete this')
    } catch (error) {
      res.status(500).end(error)
    }
  })