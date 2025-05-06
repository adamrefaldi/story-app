// src/scripts/data/database.js
import { openDB } from "idb";

const DATABASE_NAME = "story-app-db";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "stories";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    // Membuat object store jika belum ada
    if (!database.objectStoreNames.contains(OBJECT_STORE_NAME)) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
      console.log(`Object store ${OBJECT_STORE_NAME} berhasil dibuat`);
    }
  },
});

export default {
  async getAll() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async get(id) {
    if (!id) return null;
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  async save(story) {
    if (!story.id) return;
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async delete(id) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },

  async searchByName(query) {
    const stories = await this.getAll();
    return stories.filter((story) => {
      const storyName = (story.name || "").toLowerCase();
      const queryLower = query.toLowerCase();
      return storyName.includes(queryLower);
    });
  },
};
