// src/scripts/presenters/register-presenter.js

import StoryApi from "../data/story-api.js";

class RegisterPresenter {
  constructor({ view }) {
    this._view = view;
    this._storyApi = StoryApi;
  }

  isAuthenticated() {
    return this._storyApi.checkAuthentication();
  }

  async register({ name, email, password }) {
    try {
      if (!name || !email || !password) {
        this._view.showError("Semua kolom harus diisi!");
        return { success: false };
      }

      this._view.showLoading(true);

      const { error, message } = await this._storyApi.register({
        name,
        email,
        password,
      });

      if (error) {
        this._view.showError(`Error: ${message}`);
        this._view.showLoading(false);
        return { success: false };
      }

      this._view.showSuccess("Pendaftaran berhasil! Silakan login.");
      return { success: true };
    } catch (error) {
      this._view.showError(`Error: ${error.message}`);
      this._view.showLoading(false);
      return { success: false };
    }
  }
}

export default RegisterPresenter;
