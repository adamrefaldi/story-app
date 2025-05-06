import StoryApi from "../../data/story-api.js";
import CameraInitiator from "../../utils/camera-initiator.js";
import { createPageTemplate } from "../templates/page-template.js";

const AddStoryPage = {
  async render() {
    return createPageTemplate({
      title: "Tambah Cerita Baru",
      content: `
        <form id="addStoryForm" class="add-story-form">
          <div class="form-group">
            <label class="form-label">Foto</label>
            <div class="camera-container">
              <video id="camera" autoplay playsinline></video>
              <canvas id="canvas" class="d-none"></canvas>
              <img id="capturedImage" alt="Captured Image">
            </div>
            <div class="camera-buttons">
              <button type="button" id="captureButton" class="btn btn-primary">Ambil Foto</button>
              <button type="button" id="recaptureButton" class="btn btn-secondary">Ambil Ulang</button>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Lokasi</label>
            <p>Klik pada peta untuk menentukan lokasi cerita</p>
            <div id="pickLocationMap" class="map-container"></div>
            <div id="selectedLocation" class="selected-location">
              <span>Belum ada lokasi yang dipilih</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">Cerita</label>
            <textarea id="description" class="form-textarea" required></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary">Bagikan Cerita</button>
        </form>
      `,
    });
  },

  async afterRender() {
    if (!StoryApi.checkAuthentication()) {
      alert('Anda harus login terlebih dahulu untuk menambahkan cerita.');
      window.location.hash = '#/login';
      return;
    }

    const cameraElement = document.querySelector("#camera");
    const canvasElement = document.querySelector("#canvas");
    const capturedImageElement = document.querySelector("#capturedImage");
    const captureButton = document.querySelector("#captureButton");
    const recaptureButton = document.querySelector("#recaptureButton");

    this._cameraInitiator = new CameraInitiator({
      cameraElement,
      canvasElement,
      capturedImageElement,
    });

    await this._cameraInitiator.init();

    this._initLocationPicker();

    captureButton.addEventListener("click", () => {
      this._imageBase64 = this._cameraInitiator.captureImage();
      recaptureButton.style.display = "inline-block";
    });

    recaptureButton.addEventListener("click", () => {
      this._cameraInitiator.resumeCamera();
    });

    const form = document.querySelector("#addStoryForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const photoFile = await base64ToFile(this._imageBase64, "story.jpg");

      const description = document.querySelector("#description").value;

      if (!description) {
        alert("Semua kolom harus diisi!");
        return;
      }

      if (!this._imageBase64) {
        alert("Silakan ambil foto terlebih dahulu!");
        return;
      }

      if (!this._selectedLocation) {
        alert("Silakan pilih lokasi pada peta!");
        return;
      }

      try {
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = "Mengirim...";

        const { error, message } = await StoryApi.addStory({
          description: document.querySelector("#description").value,
          photoFile,
          lat: this._selectedLocation.lat,
          lon: this._selectedLocation.lng,
        });

        if (error) {
          alert(`Error: ${message}`);
          submitButton.disabled = false;
          submitButton.textContent = "Bagikan Cerita";
          return;
        }

        alert("Cerita berhasil dibagikan!");
        window.location.hash = "#/";
      } catch (error) {
        alert(`Error: ${error.message}`);

        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = "Bagikan Cerita";
      }
    });

    async function base64ToFile(base64, filename) {
      const res = await fetch(`data:image/jpeg;base64,${base64}`);
      const blob = await res.blob();
      return new File([blob], filename, { type: "image/jpeg" });
    }

    window.addEventListener("hashchange", () => {
      this._cameraInitiator.stopStream();
    });
  },

  _initLocationPicker() {
    const mapContainer = document.querySelector("#pickLocationMap");
    const selectedLocationContainer =
      document.querySelector("#selectedLocation");

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

      this._selectedLocation = { lat, lng };

      selectedLocationContainer.innerHTML = `
        <p>Lokasi dipilih: ${lat.toFixed(6)}, ${lng.toFixed(6)}</p>
      `;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
    });
  },
};

export default AddStoryPage;
