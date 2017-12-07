import { createUser, normalizePublicInfo, updateSocialInfo } from 'server/data/controllers/UserController'
import { Strategy as TwitterStrategy } from "passport-twitter"
import { User, Twitter, Profile } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'

const { URL, TWITTTER_ID, TWITTER_SECRET } = process.env

/* TWITTER AUTH */
passport.use(new TwitterStrategy({
    consumerKey: TWITTTER_ID,
    consumerSecret: TWITTER_SECRET,
    callbackURL: URL +  "api/auth/twitter/callback"
  },
  async function(token, tokenSecret, profile, done) {
    const payload = {
      id: profile.id,
      username: profile.username,
      displayName: profile.screen_name,
      image: selectn('photos[0].value', profile),
    }

    try {
      const existingUser = await User.findOne({
        where: {},
        include: [{
          model: Twitter,
          where: {id: profile.id},
        }, Profile],
        raw: true,
        nest: true,
      })

      // TODO add findUser function in UsersController

      if (existingUser) {
        // update social info incase it has changed
        await updateSocialInfo('Twitter', payload)
        // update user info (image, displayName) if it's not up to date
        const updatedUser = await normalizePublicInfo(existingUser.id)
        return done(null, updatedUser)
      }
      else {
        // TODO rework this
        const user = await createUser('Twitter', payload)
        done(null, user)
      }
    } catch (error) {
      console.error(error);
      done(error)
    }
  }
));

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .get('/twitter', passport.authenticate('twitter'))
  // TODO try disabling redirects
  // https://github.com/jaredhanson/passport-twitter#authenticate-requests
  .get('/twitter/callback',
     passport.authenticate('twitter', { successRedirect: '/',
                                        failureRedirect: '/failed-login' })) // TODO implement failure login route
export default router