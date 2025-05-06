import HomePage from '../views/pages/home-page.js';
import AddStoryPage from '../views/pages/add-story-page.js';
import LoginPage from '../views/pages/login-page.js';
import RegisterPage from '../views/pages/register-page.js';

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/add': AddStoryPage,
};

export default routes;
