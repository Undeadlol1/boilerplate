/* POLYFILLS */
import 'es6-promise/auto'
import 'isomorphic-fetch' // TODO move to server? or to webpack?
// material-ui dependency
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin(); 

/* DEPENDENCIES */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, RouterContext } from 'react-router';
import { Provider as ReduxProvider } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import store from './redux/store'
import ReduxToastr from 'react-redux-toastr'
import routesConfig from './routes'
import Translator from './containers/Translator'

/* STYLES */
if (process.env.BROWSER) require('./styles.scss')
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
// supply userAgent for material-ui prefixer in ssr
// http://stackoverflow.com/a/38100609
darkBaseTheme.userAgent = navigator.userAgent
const muiTheme = getMuiTheme(darkBaseTheme)

class App extends Component {
  render() {
    return  <MuiThemeProvider muiTheme={muiTheme}>
              <ReduxProvider store={store}>
                <Translator>
                    {
                      process.env.BROWSER
                      ? <Router history={browserHistory} routes={routesConfig} />
                      : <RouterContext {...this.props} />
                    }
                    <ReduxToastr position="top-left" progressBar />
                </Translator>
              </ReduxProvider>
            </MuiThemeProvider>
  }
}

if (process.env.BROWSER) ReactDOM.render(<App />, document.getElementById('react-root'));

export default App