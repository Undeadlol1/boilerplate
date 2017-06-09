import { mustLogin } from '../services/permissions'
import { User, Profile } from '../data/models'
import { Router } from 'express'

// routes
const limit = 12

export default Router()
  .get('/user/:username', async function({ params }, res) {
    try {
      const username  = params.username
      if (!username) return res.badRequest('invalid query')

      const user = await User.findOne({
        raw: true,
        nest: true,
        include: Profile,
        where: {username},
      })

      if (!user) res.boom.notFound('user not found')
      else res.json(user)

    } catch (error) {
      console.error(error)
      res.boom.internal(error)
    }
  })

  // currently used to update user.Profile.language
  .put('/user/:username', mustLogin, async function({ params, body }, res) {
    try {
      // TODO add user validations/permissions
      const username  = params.username

      if (!username) return res.badRequest('invalid query')
      // TODO add body validations

      const user = await User.findOne({
                          raw: true,
                          nest: true,
                          where: {username},
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
        where: {username},
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