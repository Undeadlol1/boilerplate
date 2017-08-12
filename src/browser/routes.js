import Layout from './pages/Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import MoodPage from './pages/MoodPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';
import store from 'browser/redux/store'
import { fetchUser } from 'browser/redux/actions/UserActions'
import { fetchMoods, fetchMood } from 'browser/redux/actions/MoodActions'
import { fetchNodes, actions as nodeActions } from 'browser/redux/actions/NodeActions'

/**
 * fetching is done in router config in order to properly prefetch data in SSR
 */

const routesConfig = {
  path: '/',
  component: Layout,
  indexRoute: {
    component: IndexPage,
    // fetch data
    onEnter({params}, replace, done) {
      // check if fetching is needed
      const newMoods = store.getState().mood.getIn(['new', 'moods'])
      if (newMoods.size) return done()
      else {
        Promise
        .all([
          store.dispatch(fetchMoods('new')),
          store.dispatch(fetchMoods('random')),
          store.dispatch(fetchMoods('popular')),
        ])
        .then(() => done())
      }
    }
  },
  childRoutes: [
    {
      path: 'mood/(:moodSlug)',
      component: MoodPage,
      // fetch data
      onEnter({params}, replace, done) {
        Promise
        .all([
          store.dispatch(fetchMood(params.moodSlug)),
          store.dispatch(fetchNodes(params.moodSlug)),
        ])
        .then(() => done())
      }
    },
    {
      path: 'users/(:username)',
      component: UserPage,
      onEnter({params}, replace, done) {
        const fetchedUserId = store.getState().user.getIn(['fetchedUser', 'id'])
        // check if fetching is needed
        // TODO change username to userId
        if (fetchedUserId == params.username) return done()
        else {
          store
          .dispatch(fetchUser(params.username))
          .then(() => done())
        }
      }
    },
    { path: 'login', component: LoginPage },
    { path: 'search', component: SearchPage },
    { path: 'about', component: AboutPage },
    { path: '*', component: NotFound },
    // ⚠️ Hook for cli! Do not remove 💀
  ]
}

module.exports = routesConfig;