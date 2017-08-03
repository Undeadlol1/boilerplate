import 'isomorphic-fetch' // fetch polyfill
import React from 'react'
import express from "express"
import routes from 'browser/routes'
import { Helmet } from 'react-helmet'
import session from 'express-session'
import { Provider } from 'react-redux'
import store from 'browser/redux/store'
import match from 'react-router/lib/match'
import serialize from 'serialize-javascript'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
const cache = require('express-redis-cache')();

export default
  express.Router()
  // all routes are processed client side via react-router
  .get('*',
  // TODO setup caching for logged in and unlogged
  // TODO setup caching for /mood/something
  // middleware to define cache prefix
  function (req, res, next) {
    // TODO user cache
    // set cache name
    res.express_redis_cache_name = 'url-' + req.url
    next();
  },

  // middleware to decide if using cache
  function (req, res, next) {
    // Use only cache if user not signed in
    res.use_express_redis_cache = !req.user;
    next();
  },

  // cache middleware
  cache.route(),
  // markup renderer
  function(req, res) {
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
            const sheet = new ServerStyleSheet()
            /*
              sometimes request language and browser language are not the same
              so we use browsers language (storred in cookie) as primary preference
            */
            const cookieLocale = req.cookies.locale
            const requestLocale = req.locale.language
            const language = cookieLocale || requestLocale
            global.navigator = global.navigator || {language};
            /*
              supply userAgent for material ui prefixer in ssr
              http://stackoverflow.com/a/38100609
            */
            global.navigator.userAgent = req.headers['user-agent'] || 'all';
            // require App after userAgent is set
            const App = require('browser/App').default
            // render App to string
            const markup = renderToString(
              <StyleSheetManager sheet={sheet.instance}>
                <App user={req.user} {...renderProps}/>
              </StyleSheetManager>
            )
            // extract css from string
            const css = sheet.getStyleTags()
            // extract metaData for <header>
            let headerTags = []
            const metaData = Helmet.renderStatic()
            for (var prop in metaData) {
              const tag = metaData[prop].toString()
              tag && headerTags.push(tag)
            }
            // get prefetched data from redux
            // TODO make sure to reset state afterwards
            const initialData = JSON.stringify(store.getState())//.replace(/</g, '\\u003c')
            // send data to handlebars template
            res.render('index', { markup, css, headerTags, initialData })
          }

          else res.status(404).send('Not found')
    } );
})
