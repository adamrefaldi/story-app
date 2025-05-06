// src/scripts/views/pages/home-page.js
import HomePresenter from "../../presenters/home-presenter.js";
import StoryItemTemplate from "../templates/story-item.js";
import { createPageTemplate } from "../templates/page-template.js";

const HomePage = {
  async render() {
    return createPageTemplate({
      title: "Daftar Cerita",
      content: `
        <div class="search-container">
          <input type="text" id="search-input" placeholder="Cari cerita..." />
          <button id="search-button">Cari</button>
        </div>
        <div class="map-container" id="storyMap"></div>
        <div class="offline-status-container" id="offline-status"></div>
        <div class="stories" id="stories"></div>
      `,
    });
  },

  async afterRender() {
    const storiesContainer = document.querySelector("#stories");
    const mapContainer = document.querySelector("#storyMap");
    const searchInput = document.querySelector("#search-input");
    const searchButton = document.querySelector("#search-button");
    const offlineStatus = document.querySelector("#offline-status");

    // Cek status koneksi
    this._checkConnectivity(offlineStatus);

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

    // Tambahkan event listener untuk tombol favorite
    document.addEventListener("click", async (event) => {
      if (event.target.classList.contains("favorite-button")) {
        const storyId = event.target.dataset.id;
        await this._presenter.toggleFavorite(storyId);
      }
    });

    // Fungsi pencarian
    searchButton.addEventListener("click", () => {
      const keyword = searchInput.value.trim();
      this._filterStories(keyword, stories);
    });

    // Pencarian saat menekan Enter
    searchInput.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        const keyword = searchInput.value.trim();
        this._filterStories(keyword, stories);
      }
    });
  },

  _checkConnectivity(statusContainer) {
    const updateStatus = () => {
      if (navigator.onLine) {
        statusContainer.innerHTML = "";
      } else {
        statusContainer.innerHTML = `
          <div class="offline-banner">
            <i class="fas fa-exclamation-triangle"></i>
            Anda sedang offline. Menampilkan data dari penyimpanan lokal.
          </div>
        `;
      }
    };

    // Set initial status
    updateStatus();

    // Add event listeners for online/offline events
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
  },

  _filterStories(keyword, allStories) {
    if (!keyword) {
      this.showStories(allStories);
      return;
    }

    const filteredStories = allStories.filter((story) => {
      return (
        story.name.toLowerCase().includes(keyword.toLowerCase()) ||
        story.description.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    if (filteredStories.length > 0) {
      this.showStories(filteredStories);
    } else {
      const storiesContainer = document.querySelector("#stories");
      storiesContainer.innerHTML = `<div class="empty">Tidak ada cerita yang sesuai dengan pencarian "${keyword}"</div>`;
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
      const storyItemHTML = StoryItemTemplate(story);
      const storyElement = document.createElement("div");
      storyElement.innerHTML = storyItemHTML;

      // Tambahkan tombol favorit
      const favoriteButton = document.createElement("button");
      favoriteButton.classList.add("favorite-button");
      favoriteButton.dataset.id = story.id;

      if (story.isFavorite) {
        favoriteButton.classList.add("favorited");
        favoriteButton.innerHTML = `<i class="fas fa-heart"></i> Favorit`;
      } else {
        favoriteButton.innerHTML = `<i class="far fa-heart"></i> Tambah ke Favorit`;
      }

      const storyCard = storyElement.querySelector(".story-item");
      storyCard.appendChild(favoriteButton);

      storiesContainer.appendChild(storyElement.firstElementChild);
    });
  },

  updateFavoriteStatus(storyId, isFavorite) {
    const favoriteButton = document.querySelector(
      `.favorite-button[data-id="${storyId}"]`
    );

    if (favoriteButton) {
      if (isFavorite) {
        favoriteButton.classList.add("favorited");
        favoriteButton.innerHTML = `<i class="fas fa-heart"></i> Favorit`;
      } else {
        favoriteButton.classList.remove("favorited");
        favoriteButton.innerHTML = `<i class="far fa-heart"></i> Tambah ke Favorit`;
      }
    }
  },
};

export default HomePage;
