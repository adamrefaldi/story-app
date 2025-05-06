// src/scripts/presenters/favorite-presenter.js

import StoryRepository from "../data/story-repository.js";

class FavoritePresenter {
  constructor({ view }) {
    this._view = view;
    this._storyRepository = StoryRepository;
  }

  async getFavoriteStories() {
    try {
      this._view.showLoading();

      const favoriteStories = await this._storyRepository.getFavoriteStories();

      if (favoriteStories.length === 0) {
        this._view.showEmpty();
      } else {
        this._view.showFavoriteStories(favoriteStories);
      }

      return favoriteStories;
    } catch (error) {
      this._view.showError(error.message);
      return [];
    }
  }

  async toggleFavorite(storyId) {
    try {
      const { error, message, data } =
        await this._storyRepository.toggleFavoriteStory(storyId);

      if (error) {
        this._view.showError(message);
        return;
      }

      // Refresh the favorite stories list
      await this.getFavoriteStories();

      // Show toast notification
      this._showToast(message);
    } catch (error) {
      this._view.showError(error.message);
    }
  }

  async deleteStory(storyId) {
    try {
      const { error, message } = await this._storyRepository.deleteStory(
        storyId
      );

      if (error) {
        this._view.showError(message);
        return;
      }

      // Refresh the favorite stories list
      await this.getFavoriteStories();

      // Show toast notification
      this._showToast(message);
    } catch (error) {
      this._view.showError(error.message);
    }
  }

  _showToast(message) {
    // Simple toast implementation
    const toast = document.createElement("div");
    toast.classList.add("toast");
    toast.textContent = message;

    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
      toast.classList.add("toast-hide");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
  }
}

export default FavoritePresenter;
