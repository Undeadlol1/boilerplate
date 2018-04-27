import 'isomorphic-fetch' // fetch polyfill
import React from 'react'
import express from "express"
import routes from 'browser/routes'
import { Helmet } from 'react-helmet'
import session from 'express-session'
import { Provider } from 'react-redux'
import Cookies from 'universal-cookie'
import store from 'browser/redux/store'
import themeConfig from 'browser/theme'
import match from 'react-router/lib/match'
import serialize from 'serialize-javascript'
import { renderToString } from 'react-dom/server'
import { CookiesProvider } from 'react-cookie'
import { getDataFromTree } from "react-apollo"
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { ApolloClient } from 'apollo-client';
// const cache = require('express-redis-cache')();
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from 'apollo-link-schema'
import schema from '../middlewares/graphql'

export default
  express.Router()
  // all routes are processed client side via react-router
  .get('*',
  /**
   * ⚠️ caching is disabled on purpose ⚠️
   * it caused problems with prerendered redux state not changing after code change,
   * users seeing non-theirs avatars and so on.
   */
  // TODO setup caching for logged in and unlogged
  // TODO setup caching for /mood/something
  // middleware to define cache prefix
  // function (req, res, next) {
  //   // TODO user cache
  //   // set cache name
  //   res.express_redis_cache_name = 'url-' + req.url
  //   next();
  // },

  // // middleware to decide if using cache
  // function (req, res, next) {
  //   // Use only cache if user not signed in
  //   res.use_express_redis_cache = !req.user;
  //   next();
  // },

  // // cache middleware
  // cache.route(),
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
            const cookies = new Cookies(req.headers.cookie)
            /*
              sometimes request language and browser language are not the same
              so we use browsers language (storred in cookie) as primary preference
            */
            // TODO:
            // https://www.codeproject.com/Tips/1156391/How-To-Detect-Users-Locale-Right
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
            // Create apollo client to prefetch graphql data in SSR.
            // https://www.apollographql.com/docs/react/features/server-side-rendering.html
            const apolloClient = new ApolloClient({
              ssrMode: true,
              cache: new InMemoryCache(),
              /**
               * To avoid network request during SSR
               * provide client with actual schema.
               * Plus, provide request data as context.
               * NOTE: if context will be changed,
               * don't forget to edit context in
               * actual graphql endpoint. (see: server.js)
               */
              link: new SchemaLink({ schema, context: req }),
              // TODO: test make sure this is needed.
              // fetchPolicy: 'cache-and-network',
            });
            /**
             * Prepare component for SSR.
             * This is done by providing logged in user info,
             * cookies and optimized Apollo client for data fetching.
             */
            const PreparedApp = <App
              {...renderProps}
              user={req.user}
              cookies={cookies}
              apolloClient={apolloClient}
            />
            // through this promise Apollo gathers graphql data.
            getDataFromTree(PreparedApp)
            .then(() => {
              // render App to string
              const markup = renderToString(
                <StyleSheetManager sheet={sheet.instance}>
                  {PreparedApp}
                </StyleSheetManager>
              )
              // get prefetched data from redux and apollo.
              const initialData = JSON.stringify(store.getState())
              const apolloState = JSON.stringify(apolloClient.extract())
              // reset redux store to make sure next request will have to load fresh data
              store.dispatch({type: 'RESET'})
              // Reset apollo state.
              apolloClient.resetStore()
              // extract css from string
              const css = sheet.getStyleTags()
              // extract metaData for <header>
              let headerTags = []
              const metaData = Helmet.renderStatic()
              for (var prop in metaData) {
                const tag = metaData[prop].toString()
                tag && headerTags.push(tag)
              }
              // send data to handlebars template
              res.render('index', { markup, css, themeConfig, headerTags, initialData, apolloState })
            })
            .catch(error => console.log(error))
          }
          else res.status(404).send('Not found')
    } );
})
