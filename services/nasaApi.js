// services/nasaApi.js
// All NASA API calls live here.
// We use NASA's free Image and Video Library — no API key needed.
// Base URL: https://images-api.nasa.gov/search

// ── getNASAItems ──────────────────────────────────────────────────────────────
// Used by HomeScreen to load a broad feed of NASA space images.
// "page" lets us load more results as the user scrolls (pagination).
export async function getNASAItems(page = 1) {
  const response = await fetch(
    `https://images-api.nasa.gov/search?q=space&media_type=image&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch NASA data");
  }

  return await response.json();
}

// ── searchNASA ────────────────────────────────────────────────────────────────
// Used by SearchScreen. Takes whatever the user typed and searches NASA.
// Example: searchNASA("mars", 1) calls the API with q=mars
export async function searchNASA(query, page = 1) {
  const response = await fetch(
    `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch NASA search results");
  }

  return await response.json();
}
