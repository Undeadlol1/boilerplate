import { User, Local,  Profile, Vk, Twitter } from '../data/models'
import { getUsersMoods } from '../data/controllers/MoodsController'
import { mustLogin } from '../services/permissions'
import asyncHandler from 'express-async-handler'
import merge from 'lodash/assignIn'
import { Router } from 'express'

const everything = [
  {
    model: Vk,
    required: false,
  },
  {
    model: Profile,
    required: false,
  },
  {
    model: Twitter,
    required: false,
  },
]

// routes
export default Router()
  /**
   * Get user by id.
   */
  .get('/user/:id', asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) return res.badRequest('invalid query')

    const user = await User.findById(id, {
      raw: true,
      nest: true,
      // TODO remove in future when all values will be stored in profile
      include: everything,
    })
    const moodsData = await getUsersMoods(user.id)

    if (!user) res.boom.notFound('user not found')
    else res.json(merge(user, moodsData))
  }))
  /**
   * Update user.
   * (currently used to update user.Profile.language)
   */
  // TODO add user validations/permissions
  // NOTE: only owner  can owner can update his user profile.
  .put('/user/:id', mustLogin, asyncHandler(async ({ params, body }, res) => {
      const id  = params.id
      const include = [{
        model: Profile,
        required: false,
      }]

      if (!id) return res.badRequest('invalid query')
      // TODO add body validations
      // Check if user exists.
      const user = await User.findOne({
        include,
        where: {id},
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
      // Respond with updated user document.
      res.json(
        await User.findOne({
          include,
          where: { id },
      }))
  }))