import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Votes } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

const limit = 12

export default Router()

  // get single vote
  .get('/vote/:id', async ({params}, res) => {
    try {
      res.json(
        await Votes.findById(params.id)
      )
    } catch (error) {
      res.boom.internal(error.message)
    }
  })

  // get all votes
  .get('/:parentId/:page?', async (req, res) => {
    try {
      const {parentId, page} = req.params,
            where = {parentId},
            totalVotes = await Votes.count({where}),
            offset = page ? limit * (page -1) : 0,
            totalPages = Math.ceil(totalVotes / limit),
            values = await Votes.findAll({where, limit, offset})
      res.json({ values, totalPages, currentPage: page || 1 })
    }
    catch (error) {
      res.boom.internal(error.message)
    }
  })

  // update vote
  .put('/:votesId', mustLogin, async ({user, body, params}, res) => {
    try {
      const UserId = user.id
      const vote = await Votes.findById(params.votesId)

      // check permissions
      if (vote.UserId != UserId) return res.status(401).end()
      else res.json(await vote.update(body))

    } catch (error) {
      res.boom.internal(error.message)
    }
  })

  // create vote
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      res.json(
        await Votes.create({...body, UserId})
      )
    } catch (error) {
      res.boom.internal(error.message)
    }
  })