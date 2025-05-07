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

    // Tambahkan event listener untuk tombol hapus
    document.addEventListener("click", async (event) => {
      if (
        event.target.classList.contains("delete-button") ||
        (event.target.parentElement &&
          event.target.parentElement.classList.contains("delete-button"))
      ) {
        // Dapatkan ID dari tombol atau parent-nya
        const button = event.target.classList.contains("delete-button")
          ? event.target
          : event.target.parentElement;

        const storyId = button.dataset.id;

        // Konfirmasi penghapusan
        if (confirm("Apakah Anda yakin ingin menghapus cerita ini?")) {
          await this._presenter.deleteStory(storyId);
        }
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
      const storyElement = document.createElement("div");
      storyElement.innerHTML = StoryItemTemplate(story);
      storiesContainer.appendChild(storyElement.firstElementChild);
    });
  },
};

export default HomePage;
