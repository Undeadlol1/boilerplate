import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Comments } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

const limit = 12

export default Router()

  // get all comments
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page,
            totalCommentss = await Comments.count(),
            offset = page ? limit * (page -1) : 0,
            totalPages = Math.ceil(totalCommentss / limit),
            comments = await Comments.findAll({limit, offset})
      res.json({ comments, totalPages })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single comment
  .get('/comment/:commentsId', async ({params}, res) => {
    try {
      const comment = await Comments.findById(params.commentsId)
      res.json(comment)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // update comment
  .put('/:commentsId', mustLogin, async ({user, body, params}, res) => {
    try {
      const UserId = user.id
      const comment = await Comments.findById(params.commentsId)

      // check permissions
      if (Comments.UserId != UserId) return res.status(401).end()
      else res.json(await comment.update(body))

    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // create comment
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      const comment = await Comments.create({...body, UserId})
      res.json(comment)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })