import { Strategy as VKontakteStrategy } from "passport-vkontakte"
import { Strategy as TwitterStrategy } from "passport-twitter"
import { Strategy as LocalStrategy } from "passport-local"
import { User, Profile } from '../data/models'
import passport from "passport"
import express from "express"
import selectn from 'selectn'
import { URL, VK_ID, VK_SECRET, TWITTTER_ID, TWITTER_SECRET } from '../../../config'

/**
 * abstract user creation with different social media
 * 
 * @param {String} provider service name
 * @param {String} userId service's user id
 * @param {String} display_name user's public name
 * @param {String} image user's image url
 * @returns {Promise}
 */
function findOrCreateUser(provider, userId, display_name, image) { // TODO add username
  return  User.findOrCreate({
            raw: true,    
            where: {[provider]: userId}, 
            defaults: {image, display_name} // TODO make image migration
          })
            // TODO add callbacks
}

/* VK AUTH */
passport.use(new VKontakteStrategy(
  {
    clientID:     VK_ID || '5202075',
    clientSecret: VK_SECRET || 'QjVr1JLVAXfVmZDJ6ws9',
    callbackURL:  (URL || "http://127.0.0.1:3000/") +  "api/auth/vkontakte/callback"
  },
  function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) { 
    // NOTE: params contain addition requested info    
      User.findOrCreate({
        where: {vk_id: profile.id}, 
        defaults: {
          username: profile.username, // TODO this
          display_name: profile.displayName,
          // email: params.email,
          image: selectn('photos[0].value', profile), // TODO make image migration
        },
        include: [Profile]
        // raw: true
      })
      .then(function (result) {
        const user = result[0]
        done(null, user); 
      })
      // .spread(user => done(null, user.get({plain: true})))
      .catch(done);
  }
));

/* TWITTER AUTH */
passport.use(new TwitterStrategy({
    consumerKey: TWITTTER_ID || "L9moQHoGeNq7Gz25RRmuBNeg3",
    consumerSecret: TWITTER_SECRET || "D15EvlV55IfCsGnsydRi5I9QAISzkYykKOO0rCqnowDfiUmwGZ",
    callbackURL: (URL || "http://127.0.0.1:3000/") +  "api/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({
      where: {twitter_id: profile.id}, 
      defaults: {
        username: profile.username,
        display_name: profile.username,
        image: selectn('photos[0].value', profile), // TODO make image migration
      },
      include: [Profile],      
      raw: true
    })
    .then(function (result) {
      done(null, result[0]); 
    })
    .catch(done);
  }
));

/* LOCAL AUTH */
passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
        // console.log('request!!!1');
        if(!username || !password) throw new Error('forgot credentials') // TODO this    
    User.findOne({ where: { username }})
        .then(user => {
            if (!user) {
              return done(null, false, { message: 'Username not found' });
            }
            if (!user.validPassword(password)) {
              return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user);
        })
        .catch(error => done(error))
  }
));

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true },
    function(req, username, password, done) {
      process.nextTick(function() {
        if(!username || !password) throw new Error() // TODO this
        // asynchronous
        // User.findOne wont fire unless data is sent back
        // process.nextTick(function() {

          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({where: { username }})
              .then(user => {
                // console.log('user', user)
                if (user) {
                    throw new Error()
                    // return done(null, false);//, req.flash('signupMessage', 'That username is already taken.')
                } else {
                  User.create({
                    username,
                    image: '/userpic.png',
                    password: User.generateHash(password),
                    Profile: {}
                  }, {include: [Profile]})
                  .then(newUser => done(null, newUser))
                  .catch(error => {
                    console.error(error)
                    done(error)
                  })
                }
              })
              .catch(error => {
                console.log(error)
                done(error)
              })
    });
}));

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User
    .findById(id, {
      raw: true,
      nest: true,
      include: [Profile]
    })
    .then((user) => done(null, user))
    .catch(done);
});

// routes
const router = express.Router(); // TODO refactor without "const"?
router
  .get('/twitter', passport.authenticate('twitter'))
  .get('/twitter/callback',
     passport.authenticate('twitter', { successRedirect: '/',
                                        failureRedirect: '/failed-login' })) // TODO implement failure login route
                                        // TODO maybe add { failureFlash: true } ?
  .get('/vkontakte', passport.authenticate('vkontakte')) // , {scope: ['email']}
  .get('/vkontakte/callback',
    passport.authenticate('vkontakte', { successRedirect: '/',
                                          failureRedirect: '/failed-login' }))
  .post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/xxx', // redirect back to the signup page if there is an error // TODO add failure redirect
    failureFlash : true // allow flash messages
  }))

  .post('/login', passport.authenticate('local-login', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/xxxx', // redirect back to the signup page if there is an error // TODO add failure redirect
    failureFlash : true // allow flash messages
  }))

  .get('/logout', function(req, res){
    if (req.user) {
      req.logout();
      res.end();
    }
    else {
      res.status(401).end()
    }
  })

  .get('/current_user', function(req, res) { // TODO move this to auth middleware
      res.json(req.user ? req.user : {})
  })

export {passport}
export default router