// src/scripts/routes/routes.js
import HomePage from "../views/pages/home-page.js";
import AddStoryPage from "../views/pages/add-story-page.js";
import RegisterPage from "../views/pages/register-page.js";
import LoginPage from "../views/pages/login-page.js";

const routes = {
  "/": HomePage,
  "/home": HomePage,
  "/add": AddStoryPage,
  "/register": RegisterPage,
  "/login": LoginPage
};

export default routes;
