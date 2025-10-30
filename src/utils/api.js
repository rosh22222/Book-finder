// src/utils/api.js
const BASE = "https://openlibrary.org/search.json";

/**
 * searchBooks - search OpenLibrary by title or general query
 * query: string
 * returns: promise resolving to array of docs
 */
export async function searchBooks(query, limit = 20) {
  if (!query) return { docs: [], numFound: 0 };
  const url = `${BASE}?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("OpenLibrary request failed");
  const data = await res.json();
  return data;
}
