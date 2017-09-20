import slugify from 'slug'
import { Router } from 'express'
import { ApiName } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

const limit = 12

export default Router()

  // get all apiNames
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page
      const offset = page ? limit * (page -1) : 0
      const totalApiNames = await ApiName.count()
      const totalPages = Math.ceil(totalApiNames / limit)
      const apiNames = await ApiName.findAll({
        limit,
        offset,
      })
      res.json({ apiNames, totalPages })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single apiName
  .get('/apiName/:apiNameId', async ({params}, res) => {
    try {
      const apiName = await ApiName.findById(params.apiNameId)
      res.json(apiName)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // update apiName
  .put('/:apiNameId', mustLogin, async ({user, body, params}, res) => {
    try {
      const UserId = user.id
      const apiName = await ApiName.findById(params.apiNameId)

      // check permissions
      if (apiName.UserId != UserId) return res.status(401).end()
      else res.json(await apiName.update(body))

    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // create apiName
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      const apiName = await ApiName.create({...body, UserId})
      res.json(apiName)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })