// this prevents babel to parse css as javascript
import csshook from 'css-modules-require-hook/preset'
import path from 'path'
import express from 'express'
import boom from 'express-boom' // "boom" library for express responses
import bodyParser from 'body-parser'
import session from 'express-session'
import errorhandler from 'errorhandler'
import cookieParser from 'cookie-parser'
import cookieSession from 'cookie-session'
import moodsApi from './middlewares/moodsApi'
import nodesApi from './middlewares/nodesApi'
import usersApi from './middlewares/usersApi'
import decisionsApi from './middlewares/decisionsApi'
import externalsApi from './middlewares/externalsApi'
import { mustLogin } from './services/permissions'
import authorization, { passport } from './middlewares/authApi'
import 'source-map-support/register' // do we actually need this?
import morgan from 'morgan'
import helmet from 'helmet'
import createLocaleMiddleware from 'express-locale';
import { PORT, SESSION_KEY } from '../../config'

const port = PORT || 3000,
      app = express(),
      publicUrl = path.resolve('./dist', 'public'), // TODO: or use server/public?
      cookieExpires = 100 * 60 * 24 * 100 // 100 days

// development only middlewares
if (process.env.NODE_ENV === 'development') { // TODO create dev middleware whic applues all dev specific middlewares
  app.use(errorhandler())
  app.use(morgan('dev')) // logger
}

// middlewares
app.use(helmet()) // security
// detect accepted languages for i18n
app.use(createLocaleMiddleware())
app.use(express.static(publicUrl))
app.use(cookieParser())
app.set('query parser', 'simple');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({
  name: 'session',
  keys: [SESSION_KEY || 'keyboard cat'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(boom()) // provides res.boom. erros dispatching

// REST API
app.use('/api/auth', authorization)
app.use('/api/users', usersApi)
app.use('/api/moods', moodsApi)
app.use('/api/nodes', nodesApi)
app.use('/api/decisions', decisionsApi)
app.use('/api/externals', externalsApi)

/* SEND HTML FOR SPA */
// set handlebars as templating engine
import exphbs from 'express-handlebars'
const { engine } = exphbs.create({});
app.engine('handlebars', engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './public'));

import React from 'react'
import { renderToString } from 'react-dom/server'
import { match } from 'react-router'
import routes from '../browser/routes'

// all routes are processed client side via react-router
app.get('/*', function(req, res) {
  match(
      {routes, location: req.url},
      (error, redirectLocation, renderProps) => {
        if (error) res.status(500).send(error.message)

        else if (redirectLocation) {
          const location =  redirectLocation.pathname
                            + redirectLocation.search
          res.redirect(302, location)
        }
        // render website content
        else if (renderProps) {
          // sometimes request language and browser language are not the same
          // so we use browsers language (storred in cookie) as primary preference
          const cookieLocale = req.cookies.locale
          const requestLocale = req.locale.language
          const language = cookieLocale || requestLocale
          global.navigator = global.navigator || {language};
          // supply userAgent for material ui prefixer in ssr
          // http://stackoverflow.com/a/38100609
          global.navigator.userAgent = req.headers['user-agent'] || 'all';

          // render App to string
          const App = require('browser/App.jsx').default
          const markup = renderToString(<App {...renderProps} />);
          // send string to handlebars template
          res.render('index', { markup });
        }

        else res.status(404).send('Not found')
  } );
})

// export app to use in test suits
export default app.listen(port, () => {
    if (process.env.NODE_ENV != 'test') {
      console.info(`Environment is: ${process.env.NODE_ENV}!`)
      console.info(`Server listening on port ${port}!`)
    }
})