/* POLYFILLS */
import 'es6-promise/auto'
import 'isomorphic-fetch' // TODO move to server? or to webpack?
// material-ui dependency
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin();

/* DEPENDENCIES */
import ReactGA from 'react-ga' // google analytics
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Router from 'react-router/lib/Router'
import RouterContext from 'react-router/lib/RouterContext'
import browserHistory from 'react-router/lib/browserHistory'
import { Provider as ReduxProvider } from 'react-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import store from './redux/store'
import routesConfig from './routes'
import Translator from './containers/Translator'
import { syncHistoryWithStore } from 'react-router-redux'
import { actions } from 'browser/redux/actions/UserActions'
import { CookiesProvider } from 'react-cookie'
// Apollo-client stuff.
import { HttpLink, createHttpLink } from 'apollo-link-http'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'

/* STYLES */
if (process.env.BROWSER) require('./styles.scss')
import customMuiTheme from './theme.js'
import { ThemeProvider } from 'styled-components'
import { BASE_CONF } from 'react-styled-flexboxgrid'
// import customMuiTheme from 'material-ui/styles/baseThemes/customMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// supply userAgent for material-ui prefixer in ssr
// http://stackoverflow.com/a/38100609
customMuiTheme.userAgent = navigator.userAgent
const muiTheme = getMuiTheme(customMuiTheme)

const isServer = process.env.SERVER
const isBrowser = process.env.BROWSER

// Graphql client.
export const client = new ApolloClient({
export const apolloClient = new ApolloClient({
  // To use cookies in request we need to specify credentials.
  link: createHttpLink({
    uri: process.env.URL + 'graphql',
    credentials: 'same-origin',
  }),
  // Start appolo client with data from SSR.
  cache: isServer
    ? new InMemoryCache()
    : new InMemoryCache().restore(window.__APOLLO_STATE__),
  // TODO: implement SSR properly.
  // https://www.apollographql.com/docs/react/features/server-side-rendering.html
  ssr: isServer,
});
// scroll to top of the page on route change
function scrollToTop() {
  return window.scrollTo(0, 0)
}

class App extends Component {
  componentWillMount() {
    // if SSR provided logged in user, put object in state
    store.dispatch(
      actions.recieveCurrentUser(this.props.user)
    )
    // initialize Google Analytics in browser and only in production
    if (process.env.BROWSER && process.env.NODE_ENV == 'production') {
      ReactGA.initialize(process.env.GOOGLE_ANALYTICS)
      ReactGA.pageview(window.location.pathname + window.location.search)
    }
  }

  render() {
    const cookies = process.env.SERVER ? this.props.cookies : null
    return  <MuiThemeProvider muiTheme={muiTheme}>
                <ThemeProvider theme={BASE_CONF}>
                  <ReduxProvider store={store} key="provider">
                    {/* universal cookies */}
                    <CookiesProvider cookies={cookies}>
                      {/* While SSR is active use provided client. */}
                      {/* This way data will be fetched faster and nothing will break. */}
                      <ApolloProvider client={isBrowser ? apolloClient : this.props.apolloClient}>
                        <Translator>
                          {
                            process.env.BROWSER
                            ? <Router history={syncHistoryWithStore(browserHistory, store)} routes={routesConfig} onUpdate={scrollToTop} />
                            : <RouterContext {...this.props} />
                          }
                        </Translator>
                      </ApolloProvider>
                    </CookiesProvider>
                  </ReduxProvider>
                </ThemeProvider>
            </MuiThemeProvider>
  }
}

if (process.env.BROWSER) ReactDOM.render(<App />, document.getElementById('react-root'));

App.propTypes = {
  user: PropTypes.object,
  apolloClient: PropTypes.object,
}

export default App