// missing colors in terminal was spotted on windows machines
// this line allows packages like "colors" and "chalk" work as intendent
process.stdout.isTTY = true
// Make unhandled promise rejections fail loudly instead of the default silent fail.
// https://www.npmjs.com/package/loud-rejection
if (process.env.NODE_ENV != 'production') require('loud-rejection')()
// this prevents babel to parse css as javascript
import csshook from 'css-modules-require-hook/preset'
import path from 'path'
import express from 'express'
import boom from 'express-boom' // "boom" library for express responses
import compression from 'compression'
import bodyParser from 'body-parser'
import errorhandler from 'errorhandler'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import SSR from './middlewares/SSR'
import moodsApi from './middlewares/moodsApi'
import nodesApi from './middlewares/nodesApi'
import usersApi from './middlewares/usersApi'
import decisionsApi from './middlewares/decisionsApi'
import externalsApi from './middlewares/externalsApi'
import authApi, { passport } from './middlewares/authApi'
import 'source-map-support/register' // do we actually need this?
import morgan from 'morgan'
import helmet from 'helmet'
import createLocaleMiddleware from 'express-locale';
import RateLimiter from 'express-rate-limit'
import exphbs from 'express-handlebars'

// const RedisStore = require('connect-redis')(session)
// const cache = require('express-redis-cache')();

const port = process.env.PORT,
      app = express(),
      { engine } = exphbs.create({}),
      publicUrl = path.resolve('./dist', 'public'), // TODO: or use server/public?
      cookieExpires = 100 * 60 * 24 * 100 // 100 days

/*
  Some routes return 304 if multiple calls to same route are made.
  For example: while validating user info in signup form
*/
app.disable('etag');

// middlewares
// detect accepted languages for i18n
app.use(createLocaleMiddleware())
app.use(compression())
app.use(express.static(publicUrl))
app.use(cookieParser())
app.set('query parser', 'simple');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
  name: 'session',
  // store: new RedisStore(),
  maxAge: cookieExpires,
  keys: [process.env.SESSION_KEY || 'keyboard cat'],
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(boom()) // provides res.boom. erros dispatching
app.use(helmet()) // security
// set handlebars as templating engine for SSR
app.engine('handlebars', engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './public'));

// development only middlewares
if (process.env.NODE_ENV === 'development') {
  // better request errors
  app.use(errorhandler())
  // request logger
  app.use(morgan('dev'))
  // enable 'access control' to avoid CORS errors in browsersync
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  })
}

// production only middlewares
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('dev')) // logger
  // rate limiter
  // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)
  // app.enable('trust proxy');
  // app.use(
  //   new RateLimiter({
  //     windowMs: 15*60*1000, // 15 minutes
  //     max: 100, // limit each IP to 100 requests per windowMs
  //     delayMs: 200 // disable delaying - full speed until the max limit is reached
  //   })
  // )
}

/* error handling */
// http://expressjs.com/en/guide/error-handling.html
// https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016


// CORS PERMISSIONS
// (almost everything is allowed)
app.options("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

// REST API
app.use('/api/auth', authApi)
app.use('/api/users', usersApi)
app.use('/api/moods', moodsApi)
app.use('/api/nodes', nodesApi)
app.use('/api/decisions', decisionsApi)
app.use('/api/externals', externalsApi)
app.use('/api/forums', require('./middlewares/forumsApi').default)
app.use('/api/threads', require('./middlewares/threadsApi').default)
app.use('/api/comments', require('./middlewares/commentsApi').default)
app.use('/api/subscriptions', require('./middlewares/subscriptionsApi').default)
// ⚠️ Hook for cli! Do not remove 💀

// SPA
app.use(SSR)

// export app to use in test suits
export default app.listen(port, () => {
    if (process.env.NODE_ENV != 'test') {
      console.info(`Environment is: ${process.env.NODE_ENV}!`)
      console.info(`Server listening on port ${port}!`)
    }
})