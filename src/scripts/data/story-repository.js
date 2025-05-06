// src/scripts/data/story-repository.js
import StoryApi from "./story-api.js";
import DB from "./database.js";

class StoryRepository {
  static async getAllStories() {
    try {
      // Coba ambil data dari API dulu
      const {
        error,
        data: onlineStories,
        message,
      } = await StoryApi.getAllStories();

      if (!error) {
        // Jika online berhasil, simpan ke IndexedDB untuk akses offline
        await this._saveStoriesToIndexedDB(onlineStories);
        return { error: false, data: onlineStories };
      }

      // Jika gagal mengambil dari API, coba ambil dari IndexedDB
      console.log(
        "Gagal mengambil data online. Mencoba mengambil dari IndexedDB..."
      );
      const offlineStories = await DB.getAll();

      if (offlineStories.length) {
        return {
          error: false,
          data: offlineStories,
          isOffline: true,
        };
      }

      // Jika tidak ada data di IndexedDB juga
      return {
        error: true,
        message: "Tidak dapat memuat cerita. Periksa koneksi internet Anda.",
      };
    } catch (error) {
      console.error("Error in getAllStories:", error);
      return { error: true, message: error.message };
    }
  }

  static async _saveStoriesToIndexedDB(stories) {
    try {
      await Promise.all(
        stories.map(async (story) => {
          await DB.save(story);
        })
      );
      console.log(`${stories.length} cerita berhasil disimpan ke IndexedDB`);
    } catch (error) {
      console.error("Error menyimpan ke IndexedDB:", error);
    }
  }

  static async getStoredStories() {
    return DB.getAll();
  }

  static async getFavoriteStories() {
    const stories = await DB.getAll();
    return stories.filter((story) => story.isFavorite);
  }

  static async getStoryById(id) {
    return DB.get(id);
  }

  static async toggleFavoriteStory(id) {
    try {
      // Ambil cerita dari IndexedDB
      const story = await DB.get(id);

      if (!story) {
        return { error: true, message: "Cerita tidak ditemukan" };
      }

      // Toggle status favorite
      story.isFavorite = !story.isFavorite;

      // Simpan kembali ke IndexedDB
      await DB.save(story);

      return {
        error: false,
        message: story.isFavorite
          ? "Cerita berhasil ditambahkan ke favorit"
          : "Cerita dihapus dari favorit",
        data: story,
      };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  static async deleteStory(id) {
    try {
      await DB.delete(id);
      return {
        error: false,
        message: "Cerita berhasil dihapus dari penyimpanan lokal",
      };
    } catch (error) {
      return { error: true, message: error.message };
    }
  }
}

export default StoryRepository;
