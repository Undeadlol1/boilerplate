import { User, Local,  Profile, Vk, Twitter } from '../data/models'
import { getUsersMoods } from '../data/controllers/MoodsController'
import { mustLogin } from '../services/permissions'
import { Router } from 'express'
import merge from 'lodash/assignIn'

// routes
const limit = 12

export default Router()
  .get('/user/:id', async function({ params }, res) {
    try {
      const id  = params.id
      if (!id) return res.badRequest('invalid query')

      const user =  await User.findById(id, {
                      raw: true,
                      nest: true,
                      // TODO remove in future when all values will be stored in profile
                      include: [Profile, Local, Vk, Twitter],
                    })
      const moodsData = await getUsersMoods(user.id)

      if (!user) res.boom.notFound('user not found')
      else res.json(merge(user, moodsData))

    } catch (error) {
      console.error(error)
      res.boom.internal(error)
    }
  })

  // currently used to update user.Profile.language
  .put('/user/:id', mustLogin, async function({ params, body }, res) {
    try {
      // TODO add user validations/permissions
      const id  = params.id

      if (!id) return res.badRequest('invalid query')
      // TODO add body validations

      const user = await User.findOne({
                          raw: true,
                          nest: true,
                          where: {id},
                          include: [Profile],
                        })
      if (!user) return res.boom.notFound('user not found')

      // check if profile exists, create it if not
      if (!user.Profile.id) {
        await Profile.create({
          UserId: user.id,
          language: body.language
        })
      }
      else {
        await Profile.update(
          {language: body.language},
          {where: {UserId: user.id}}
        )
      }

      const userWithProfile = await User.findOne({
        where: {id},
        include: [Profile],
        raw: true,
        nest: true,
      })

      res.json(userWithProfile)

    } catch (error) {
      console.error(error)
      res.boom.internal(error)
    }
  })