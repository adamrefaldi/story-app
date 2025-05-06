import { defineConfig } from "vite";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        offline: resolve(__dirname, "offline.html"),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: ["icons/*.png", "screenshots/*.png"],
      manifest: {
        name: "Dicoding Story Platform",
        short_name: "Story App",
        description: "Platform untuk berbagi kisah dan cerita menarik",
        theme_color: "#4a90e2",
        icons: [
          {
            src: "/icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Tambah Cerita Baru",
            short_name: "Tambah Cerita",
            description: "Tambahkan cerita baru ke platform",
            url: "/#/add",
            icons: [
              {
                src: "/icons/add-story-icon-96x96.png",
                sizes: "96x96",
                type: "image/png",
              },
            ],
          },
        ],
        screenshots: [
          {
            src: "/screenshots/desktop-screenshot.png",
            sizes: "1280x800",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/screenshots/mobile-screenshot.png",
            sizes: "320x640",
            type: "image/png",
            form_factor: "narrow",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/cdnjs\.cloudflare\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cdn-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "unpkg-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /^https:\/\/api\.dicoding\.com\/v1\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 1 * 24 * 60 * 60, // 1 day
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
});
