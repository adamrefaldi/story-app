// src/scripts/presenters/login-presenter.js

import StoryApi from "../data/story-api.js";

class LoginPresenter {
  constructor({ view }) {
    this._view = view;
    this._storyApi = StoryApi;
  }

  isAuthenticated() {
    return this._storyApi.checkAuthentication();
  }

  async login({ email, password }) {
    try {
      if (!email || !password) {
        this._view.showError("Email dan password harus diisi!");
        return { success: false };
      }

      this._view.showLoading(true);

      const { error, message } = await this._storyApi.login({
        email,
        password,
      });

      if (error) {
        this._view.showError(`Error: ${message}`);
        this._view.showLoading(false);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      this._view.showError(`Error: ${error.message}`);
      this._view.showLoading(false);
      return { success: false };
    }
  }
}

export default LoginPresenter;
