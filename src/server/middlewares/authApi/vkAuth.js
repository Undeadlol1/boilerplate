import { createUser, normalizePublicInfo, updateSocialInfo } from 'server/data/controllers/UserController'
import { Strategy as VKontakteStrategy } from "passport-vkontakte"
import { User, Vk, Profile } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'

const { URL, VK_ID, VK_SECRET,} = process.env

/* VK AUTH */
passport.use(new VKontakteStrategy(
  {
    clientID:     VK_ID,
    clientSecret: VK_SECRET,
    callbackURL:  URL +  "api/auth/vkontakte/callback"
  },
  async function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {
    const payload = {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      image: selectn('photos[0].value', profile),
    }

    try {
      const existingUser = await User.findOne({
        where: {},
        include: [{
          model: Vk,
          where: {id: profile.id},
        }, Profile],
        raw: true,
        nest: true,
      })

      // TODO add findUser function in UsersController

      if (existingUser) {
        // update social info incase it has changed
        await updateSocialInfo('Vk', payload)
        // update user info (image, displayName) if it's not up to date
        const updatedUser = await normalizePublicInfo(existingUser.id)
        return done(null, updatedUser)
      }
      else {
        const user = await createUser('Vk', payload)
        console.log('user: ', user);
        done(null, user)
      }
    } catch (error) {
      console.error(error)
      done(error)
    }
  }
));

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .get('/vkontakte', passport.authenticate('vkontakte')) // , {scope: ['email']}
  .get('/vkontakte/callback',
    passport.authenticate('vkontakte', { successRedirect: '/',
                                          failureRedirect: '/failed-login' }))

export default router