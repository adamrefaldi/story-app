const CACHE_NAME = "dicoding-story-v1";

// Aset-aset untuk Application Shell
const APP_SHELL_ASSETS = [
  "/",
  "/index.html",
  "/src/styles/main.css",
  "/src/styles/responsive.css",
  "/src/scripts/app.js",
  "/src/scripts/routes/routes.js",
  "/src/scripts/routes/url-parser.js",
  "/src/scripts/views/app-shell.js",
  "/src/scripts/utils/drawer-initiator.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/webfonts/fa-solid-900.woff2",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "/icons/icon-72x72.png",
  "/icons/icon-96x96.png",
  "/icons/icon-128x128.png",
  "/icons/icon-144x144.png",
  "/icons/icon-152x152.png",
  "/icons/icon-192x192.png",
  "/icons/icon-384x384.png",
  "/icons/icon-512x512.png",
];

// Event install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_ASSETS);
    })
  );
});

// Event activate untuk pembersihan cache lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Event fetch untuk strategi caching
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Strategi Cache First untuk Application Shell
  if (
    APP_SHELL_ASSETS.includes(requestUrl.pathname) ||
    event.request.url.includes("cdnjs") ||
    event.request.url.includes("unpkg")
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // Strategi Stale While Revalidate untuk API dan konten dinamis
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(`${CACHE_NAME}-api`).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Simpan salinan respons baru ke cache
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Jika offline, ambil dari cache
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  // Strategi Network First untuk konten lainnya
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }

          // Jika tidak ada di cache, tampilkan halaman offline
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match("/index.html");
          }

          return new Response("Network error happened", {
            status: 408,
            headers: { "Content-Type": "text/plain" },
          });
        });
      })
  );
});

// Event push untuk push notification (akan diimplementasikan nanti)
self.addEventListener("push", (event) => {
  console.log("Push event received");
  // Implementasi push notification akan ditambahkan nanti
});
