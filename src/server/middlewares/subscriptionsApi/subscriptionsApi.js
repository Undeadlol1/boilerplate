import slugify from 'slug'
import { Router } from 'express'
import generateUuid from 'uuid/v4'
import { Subscriptions } from 'server/data/models'
import { mustLogin } from 'server/services/permissions'

const limit = 12

export default Router()

  // get all subscriptions
  .get('/:page?', async (req, res) => {
    try {
      const page = req.params.page,
            totalSubscriptionss = await Subscriptions.count(),
            offset = page ? limit * (page -1) : 0,
            totalPages = Math.ceil(totalSubscriptionss / limit),
            subscriptions = await Subscriptions.findAll({limit, offset})
      res.json({ subscriptions, totalPages })
    }
    catch (error) {
      console.log(error);
      res.status(500).end(error)
    }
  })

  // get single subscription
  .get('/subscription/:id', async ({params}, res) => {
    try {
      const subscription =  await Subscriptions.findOne({
                          where: {id: params.id}
                        })
      res.json(subscription)
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // update subscription
  .put('/:subscriptionsId', mustLogin, async ({user, body, params}, res) => {
    try {
      const UserId = user.id
      const subscription = await Subscriptions.findById(params.subscriptionsId)

      // check permissions
      if (Subscriptions.UserId != UserId) return res.status(401).end()
      else res.json(await subscription.update(body))

    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })

  // create subscription
  .post('/', mustLogin, async ({user, body}, res) => {
    try {
      const UserId = user.id
      res.json(
        await Subscriptions.create({...body, UserId})
      )
    } catch (error) {
      console.log(error)
      res.status(500).end(error)
    }
  })