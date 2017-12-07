import { User, Profile, Local, Twitter } from 'server/data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'
import local from './localAuth'
import twitter from './twitterAuth'
import vk from './vkAuth'

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User
    .findById(id, {
      raw: true,
      nest: true,
      include: [Profile, Local, Twitter]
    })
    .then(user => done(null, user))
    .catch(error => {
      console.error(error)
      done(error)
    });
});

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .use(local)
  .use(twitter)
  .use(vk)
  .get('/logout', (req, res) => {
    if (req.user) {
      req.logout()
      req.session = null
      // req.session.destroy()
      res.end()
    }
    else res.status(401).end()
  })
  .get('/current_user', (req, res) => {
      res.json(req.user ? req.user : {})
  })

export {passport}
export default router