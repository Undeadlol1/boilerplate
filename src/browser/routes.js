// PAGES
import Layout from './pages/Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import MoodPage from './pages/MoodPage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';

const routesConfig = {
  path: '/',
  component: Layout,
  indexRoute: { component: IndexPage },
  childRoutes: [
    { path: 'login', component: LoginPage },
    { path: 'users/(:username)', component: UserPage },
    { path: 'mood/(:moodSlug)', component: MoodPage },
    { path: 'search', component: SearchPage },
    { path: 'about', component: AboutPage },
    { path: '*', component: NotFound },
  ]
}

module.exports = routesConfig;