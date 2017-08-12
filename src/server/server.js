// this prevents babel to parse css as javascript
import csshook from 'css-modules-require-hook/preset'
import path from 'path'
import express from 'express'
import boom from 'express-boom' // "boom" library for express responses
import compression from 'compression'
import bodyParser from 'body-parser'
import session from 'express-session'
import errorhandler from 'errorhandler'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import SSR from './middlewares/SSR'
import moodsApi from './middlewares/moodsApi'
import nodesApi from './middlewares/nodesApi'
import usersApi from './middlewares/usersApi'
import decisionsApi from './middlewares/decisionsApi'
import externalsApi from './middlewares/externalsApi'
import { mustLogin } from './services/permissions'
import authApi, { passport } from './middlewares/authApi'
import 'source-map-support/register' // do we actually need this?
import morgan from 'morgan'
import helmet from 'helmet'
import createLocaleMiddleware from 'express-locale';
import RateLimiter from 'express-rate-limit'
import exphbs from 'express-handlebars'

const RedisStore = require('connect-redis')(session)
// const cache = require('express-redis-cache')();

const port = process.env.PORT || 3000,
      app = express(),
      publicUrl = path.resolve('./dist', 'public'), // TODO: or use server/public?
      cookieExpires = 100 * 60 * 24 * 100, // 100 days
      { engine } = exphbs.create({})

/*
  some routes return 304 if
  multiple calls to same route are made
  (while validating user info in signup form, for example)
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
  store: new RedisStore(),
  keys: [process.env.SESSION_KEY || 'keyboard cat'],
  maxAge: 24 * 60 * 60 * 1000 * 30 * 3 // 3 months
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
  app.use(errorhandler())
  app.use(morgan('dev')) // logger
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

// REST API
app.use('/api/auth', authApi)
app.use('/api/users', usersApi)
app.use('/api/moods', moodsApi)
app.use('/api/nodes', nodesApi)
app.use('/api/decisions', decisionsApi)
app.use('/api/externals', externalsApi)
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