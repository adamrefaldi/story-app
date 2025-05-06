// src/scripts/views/pages/favorite-page.js
import FavoritePresenter from "../../presenters/favorite-presenter.js";
import StoryItemTemplate from "../templates/story-item.js";
import { createPageTemplate } from "../templates/page-template.js";

const FavoritePage = {
  async render() {
    return createPageTemplate({
      title: "Cerita Favorit",
      content: `
        <div class="favorite-header">
          <h2>Cerita Favorit Saya</h2>
          <p>Cerita yang Anda simpan untuk dibaca nanti</p>
        </div>
        <div class="stories" id="favorite-stories"></div>
      `,
    });
  },

  async afterRender() {
    const storiesContainer = document.querySelector("#favorite-stories");

    // Inisialisasi presenter dengan view
    this._presenter = new FavoritePresenter({
      view: this,
    });

    // Mendapatkan data dari presenter
    await this._presenter.getFavoriteStories();

    // Tambahkan event listener untuk tombol hapus favorit
    document.addEventListener("click", async (event) => {
      if (event.target.classList.contains("favorite-button")) {
        const storyId = event.target.dataset.id;
        await this._presenter.toggleFavorite(storyId);
      }

      if (event.target.classList.contains("delete-button")) {
        const storyId = event.target.dataset.id;
        if (
          confirm(
            "Apakah Anda yakin ingin menghapus cerita ini dari penyimpanan lokal?"
          )
        ) {
          await this._presenter.deleteStory(storyId);
        }
      }
    });
  },

  // Implementasi interface view untuk presenter
  showLoading() {
    const storiesContainer = document.querySelector("#favorite-stories");
    storiesContainer.innerHTML =
      '<div class="loading">Memuat cerita favorit...</div>';
  },

  showError(message) {
    const storiesContainer = document.querySelector("#favorite-stories");
    storiesContainer.innerHTML = `<div class="error">Error: ${message}</div>`;
  },

  showEmpty() {
    const storiesContainer = document.querySelector("#favorite-stories");
    storiesContainer.innerHTML =
      '<div class="empty">Belum ada cerita favorit</div>';
  },

  showFavoriteStories(stories) {
    const storiesContainer = document.querySelector("#favorite-stories");
    storiesContainer.innerHTML = "";

    stories.forEach((story) => {
      const storyItemHTML = StoryItemTemplate(story);
      const storyElement = document.createElement("div");
      storyElement.innerHTML = storyItemHTML;

      // Tambahkan tombol hapus
      const actionButtons = document.createElement("div");
      actionButtons.classList.add("story-actions");

      // Tombol toggle favorit
      const favButton = document.createElement("button");
      favButton.classList.add("favorite-button");
      favButton.dataset.id = story.id;
      favButton.innerHTML = `<i class="fas fa-heart"></i> Hapus dari Favorit`;

      // Tombol hapus dari IndexedDB
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.dataset.id = story.id;
      deleteButton.innerHTML = `<i class="fas fa-trash"></i> Hapus dari Penyimpanan`;

      actionButtons.appendChild(favButton);
      actionButtons.appendChild(deleteButton);

      // Tambahkan ke story element
      const storyCard = storyElement.querySelector(".story-item");
      storyCard.appendChild(actionButtons);

      storiesContainer.appendChild(storyElement.firstElementChild);
    });
  },
};

export default FavoritePage;
