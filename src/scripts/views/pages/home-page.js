// src/scripts/views/pages/home-page.js
import HomePresenter from "../../presenters/home-presenter.js";
import StoryItemTemplate from "../templates/story-item.js";
import { createPageTemplate } from "../templates/page-template.js";

const HomePage = {
  async render() {
    return createPageTemplate({
      title: "Daftar Cerita",
      content: `
        <div class="map-container" id="storyMap"></div>
        <div class="stories" id="stories"></div>
      `,
    });
  },

  async afterRender() {
    const storiesContainer = document.querySelector("#stories");
    const mapContainer = document.querySelector("#storyMap");

    // Inisialisasi presenter dengan view
    this._presenter = new HomePresenter({
      view: this,
    });

    // Mendapatkan data dari presenter
    const stories = await this._presenter.getAllStories();

    // Inisialisasi peta jika ada cerita
    if (stories.length > 0) {
      this._presenter.initMap(mapContainer, stories);
    }
  },

  // Implementasi interface view untuk presenter
  showLoading() {
    const storiesContainer = document.querySelector("#stories");
    storiesContainer.innerHTML = '<div class="loading">Memuat cerita...</div>';
  },

  showError(message) {
    const storiesContainer = document.querySelector("#stories");
    storiesContainer.innerHTML = `<div class="error">Error: ${message}</div>`;
  },

  showEmpty() {
    const storiesContainer = document.querySelector("#stories");
    storiesContainer.innerHTML =
      '<div class="empty">Belum ada cerita yang dibagikan</div>';
  },

  showStories(stories) {
    const storiesContainer = document.querySelector("#stories");
    storiesContainer.innerHTML = "";
    stories.forEach((story) => {
      storiesContainer.innerHTML += StoryItemTemplate(story);
    });
  },
};

export default HomePage;
