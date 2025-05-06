// src/scripts/presenters/add-story-presenter.js

import StoryApi from "../data/story-api.js";

class AddStoryPresenter {
  constructor({ view }) {
    this._view = view;
    this._storyApi = StoryApi;
  }

  isAuthenticated() {
    return this._storyApi.checkAuthentication();
  }

  async addStory({ description, photoFile, lat, lon }) {
    try {
      if (!this.isAuthenticated()) {
        this._view.showError(
          "Anda harus login terlebih dahulu untuk menambahkan cerita."
        );
        return { success: false };
      }

      if (!description || !photoFile || !lat || !lon) {
        this._view.showError("Semua kolom harus diisi!");
        return { success: false };
      }

      this._view.showLoading(true);

      const { error, message } = await this._storyApi.addStory({
        description,
        photoFile,
        lat,
        lon,
      });

      if (error) {
        this._view.showError(`Error: ${message}`);
        this._view.showLoading(false);
        return { success: false };
      }

      this._view.showSuccess("Cerita berhasil dibagikan!");
      return { success: true };
    } catch (error) {
      this._view.showError(`Error: ${error.message}`);
      this._view.showLoading(false);
      return { success: false };
    }
  }

  async base64ToFile(base64, filename) {
    const res = await fetch(`data:image/jpeg;base64,${base64}`);
    const blob = await res.blob();
    return new File([blob], filename, { type: "image/jpeg" });
  }

  initLocationPicker(
    mapContainer,
    selectedLocationContainer,
    onLocationSelected
  ) {
    const map = L.map(mapContainer).setView([-0.789275, 113.921327], 5); // Indonesia centered

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

    let marker = null;

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      const selectedLocation = { lat, lng };

      if (selectedLocationContainer) {
        selectedLocationContainer.innerHTML = `
          <p>Lokasi dipilih: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
        `;
      }

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }

      if (onLocationSelected) {
        onLocationSelected(selectedLocation);
      }
    });

    return map;
  }
}

export default AddStoryPresenter;
