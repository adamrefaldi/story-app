// src/scripts/presenters/home-presenter.js

import StoryApi from "../data/story-api.js";

class HomePresenter {
  constructor({ view }) {
    this._view = view;
    this._storyApi = StoryApi;
  }

  async getAllStories() {
    try {
      this._view.showLoading();

      const {
        error,
        data: stories,
        message,
      } = await this._storyApi.getAllStories();

      if (error) {
        this._view.showError(message);
        return [];
      }

      if (stories.length === 0) {
        this._view.showEmpty();
      } else {
        this._view.showStories(stories);
      }

      return stories;
    } catch (error) {
      this._view.showError(error.message);
      return [];
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
}

export default HomePresenter;
