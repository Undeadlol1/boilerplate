import { User, Profile, Local, Twitter, Vk } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'
import local from './localAuth'
import twitter from './twitterAuth'
import vk from './vkAuth'

// User session support for our hypothetical `user` objects.
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(function(id, done) {
  return User
  .findById(id, {
    raw: true,
    nest: true,
    /**
     * After update of "sequelize" package
     * something broke and user were null untill
     * i specify "required: false" everywhere.
     */
    include: [{
        model: Local,
        required: false,
      },
      {
        model: Profile,
        required: false,
      }, {
        model: Twitter,
        required: false,
      }, {
        model: Vk,
        required: false,
      }
    ]
  })
  .then(user => done(null, user))
  .catch(error => done(error))
})

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .use(local)
  .use(twitter)
  .use(vk)
  .get('/logout', (req, res) => {
      if (req.user) {
        logoutUser(req)
        res.end()
      }
      else res.status(401).end()
  })
  .get('/current_user', ({user}, res) => {
      res.json(user || {})
  })

/**
 * Log out current user.
 * NOTE: this function is going to be used in various places.
 * For example, in graphql resolver.
 * Be carefull while changing it.
 * @param {Object} request server request instance.
 * @exports
 */
function logoutUser(request) {
  request.logout()
  request.session = null
}

export { passport, logoutUser }
export default router