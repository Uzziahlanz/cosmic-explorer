// services/favorites.js
// Simple helper functions for saving/loading/removing favorites using AsyncStorage.
// AsyncStorage works like a key-value store on the device.
// It only stores strings, so we use JSON.stringify/JSON.parse to convert our objects.

import AsyncStorage from "@react-native-async-storage/async-storage";

// The key we use to store favorites in AsyncStorage
const STORAGE_KEY = "cosmic_favorites";

// ── getFavorites ──────────────────────────────────────────────────────────────
// Reads the saved favorites from the device and returns them as an array.
// If nothing is saved yet, returns an empty array.
export async function getFavorites() {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("getFavorites error:", e);
    return [];
  }
}

// ── saveFavorite ──────────────────────────────────────────────────────────────
// Adds a NASA item to the favorites list.
// First checks if it already exists (by nasa_id) to prevent duplicates.
// Returns the updated favorites array.
export async function saveFavorite(item) {
  try {
    const existing = await getFavorites();
    const nasaId = item?.data?.[0]?.nasa_id;

    // Don't add if it's already in the list
    const alreadyExists = existing.some(
      (fav) => fav?.data?.[0]?.nasa_id === nasaId
    );
    if (alreadyExists) return existing;

    const updated = [item, ...existing]; // add to the front of the list
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("saveFavorite error:", e);
    return [];
  }
}

// ── removeFavorite ────────────────────────────────────────────────────────────
// Removes a NASA item from the favorites list by its nasa_id.
// Returns the updated favorites array.
export async function removeFavorite(nasaId) {
  try {
    const existing = await getFavorites();
    const updated = existing.filter(
      (fav) => fav?.data?.[0]?.nasa_id !== nasaId
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("removeFavorite error:", e);
    return [];
  }
}

// ── isFavorite ────────────────────────────────────────────────────────────────
// Quick check: returns true if the item with the given nasa_id is saved.
export async function isFavorite(nasaId) {
  try {
    const existing = await getFavorites();
    return existing.some((fav) => fav?.data?.[0]?.nasa_id === nasaId);
  } catch (e) {
    return false;
  }
}
