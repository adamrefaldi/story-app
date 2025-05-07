// src/scripts/presenters/home-presenter.js

import StoryRepository from "../data/story-repository.js";

class HomePresenter {
  constructor({ view }) {
    this._view = view;
    this._storyRepository = StoryRepository;
  }

  async getAllStories() {
    try {
      this._view.showLoading();

      const {
        error,
        data: stories,
        message,
        isOffline,
      } = await this._storyRepository.getAllStories();

      if (error) {
        this._view.showError(message);
        return [];
      }

      if (stories.length === 0) {
        this._view.showEmpty();
      } else {
        this._view.showStories(stories);

        // Tampilkan notifikasi jika data berasal dari offline storage
        if (isOffline) {
          this._showOfflineNotification();
        }
      }

      return stories;
    } catch (error) {
      this._view.showError(error.message);
      return [];
    }
  }

  async deleteStory(storyId) {
    try {
      const { error, message } = await this._storyRepository.deleteStory(
        storyId
      );

      if (error) {
        this._view.showError(message);
        return false;
      }

      // Tampilkan notifikasi toast
      this._showToast(message);

      // Refresh stories setelah penghapusan
      await this.getAllStories();
      return true;
    } catch (error) {
      this._view.showError(error.message);
      return false;
    }
  }

  initMap(container, stories) {
    // Logika inisialisasi peta yang dipindahkan dari home-page.js
    const map = L.map(container).setView([-0.789275, 113.921327], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const satellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }
    );

    const baseMaps = {
      Street: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ),
      Satellite: satellite,
      Topography: L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
        }
      ),
    };

    L.control.layers(baseMaps).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);

        marker.bindPopup(`
          <div class="popup-content">
            <img src="${story.photoUrl}" alt="${
          story.name
        }" style="width: 100px; height: auto;">
            <h3>${story.name}</h3>
            <p>${story.description.substring(0, 100)}${
          story.description.length > 100 ? "..." : ""
        }</p>
          </div>
        `);
      }
    });

    return map;
  }

  _showOfflineNotification() {
    const notification = document.createElement("div");
    notification.classList.add("offline-notification");
    notification.innerHTML = `
      <div class="offline-icon">
        <i class="fas fa-wifi-slash"></i>
      </div>
      <div class="offline-message">
        <strong>Anda sedang melihat data offline</strong>
        <p>Koneksi internet tidak tersedia. Data ditampilkan dari penyimpanan lokal.</p>
      </div>
    `;

    document.body.appendChild(notification);

    // Sembunyikan notifikasi setelah 5 detik
    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 5000);
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

export default HomePresenter;
