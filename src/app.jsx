// src/App.jsx
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import { searchBooks } from "./utils/api";

function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 600);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numFound, setNumFound] = useState(0);

  const performSearch = useCallback(async (q) => {
    if (!q) {
      setBooks([]);
      setNumFound(0);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchBooks(q, 30);
      setBooks(data.docs || []);
      setNumFound(data.numFound || 0);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  // auto search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Book Finder</h1>
          <p className="text-gray-600 mt-1">Search books using the OpenLibrary API</p>
        </header>

        <div className="mb-6">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={() => performSearch(query)}
          />
        </div>

        <div className="mb-4 text-sm text-gray-600">
          {loading && "Searching..."}
          {!loading && numFound !== 0 && <span>{numFound} results</span>}
          {error && <span className="text-red-500">Error: {error}</span>}
        </div>

        <main>
          <BookList books={books} />
        </main>

        <footer className="mt-8 text-xs text-gray-500 text-center">
          Data from OpenLibrary.org
        </footer>
      </div>
    </div>
  );
}
