// src/App.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

const BASE_URL = "https://openlibrary.org/search.json";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState({ author: "", year: "" });
  const [selectedBook, setSelectedBook] = useState(null);
  const [showScroll, setShowScroll] = useState(false);
  const [initialView, setInitialView] = useState(true);

  // 🩵 Load favorites
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // 💾 Save favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // 🌀 Scroll button
  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🪶 Load featured books
  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  const fetchFeaturedBooks = async () => {
    setLoading(true);
    try {
      const topics = ["harry potter", "lord of the rings", "pride and prejudice"];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const res = await fetch(`${BASE_URL}?title=${randomTopic}&limit=20`);
      const data = await res.json();
      setFeaturedBooks(data.docs || []);
    } catch {
      setError("Unable to load featured books.");
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async (term) => {
    if (!term.trim()) return;
    setLoading(true);
    setError("");
    setInitialView(false);
    try {
      const res = await fetch(`${BASE_URL}?q=${encodeURIComponent(term)}&limit=30`);
      const data = await res.json();
      setBooks(data.docs || []);
    } catch {
      setError("Error fetching data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooks(query);
  };

  const toggleFavorite = (book) => {
    if (favorites.some((b) => b.key === book.key)) {
      setFavorites(favorites.filter((b) => b.key !== book.key));
    } else {
      setFavorites([...favorites, book]);
    }
  };

  const filteredBooks = (initialView ? featuredBooks : books).filter((book) => {
    const authorMatch = filter.author
      ? book.author_name?.join(", ").toLowerCase().includes(filter.author.toLowerCase())
      : true;
    const yearMatch = filter.year
      ? String(book.first_publish_year || "").includes(filter.year)
      : true;
    return authorMatch && yearMatch;
  });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        darkMode
          ? "text-gray-100 bg-gray-900"
          : "text-gray-800 bg-gradient-to-b from-teal-50 via-blue-50 to-white"
      } transition-all duration-700`}
    >
      {/* 🌈 Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-70"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundImage: darkMode
            ? "linear-gradient(-45deg, #0f172a, #1e293b, #334155, #0f172a)"
            : "linear-gradient(-45deg, #14b8a6, #60a5fa, #a5b4fc, #14b8a6)",
          backgroundSize: "300% 300%",
        }}
      ></motion.div>

      {/* Floating Circles */}
      <motion.div
        className="absolute w-72 h-72 bg-teal-400/30 rounded-full blur-3xl -top-16 -left-16"
        animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl bottom-0 right-0"
        animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

      <div className="max-w-6xl mx-auto p-6 relative z-10">
        {/* Navbar */}
        <motion.header
          className={`flex justify-between items-center backdrop-blur-md rounded-2xl p-4 mb-8 shadow-lg border ${
            darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/70 border-gray-200"
          }`}
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">
               Book Explorer
            </h1>
            <p className="text-xs text-gray-500">Discover. Explore. Collect.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Favorites */}
            <div className="relative">
              <button
                onClick={() =>
                  alert(`You have ${favorites.length} favorite book${favorites.length === 1 ? "" : "s"}.`)
                }
                className="text-2xl hover:scale-110 transition-transform"
              >
                ♥️
              </button>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </div>

            {/* Dark Mode */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full border ${
                darkMode ? "bg-yellow-400" : "bg-gray-200"
              }`}
            >
              {darkMode ? "🌞" : "🌙"}
            </motion.button>
          </div>
        </motion.header>

        {/* Search */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 mb-6 justify-center"
        >
          <input
            type="text"
            placeholder="Search books..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`flex-1 rounded-xl px-4 py-3 shadow-sm border text-base font-medium ${
              darkMode
                ? "bg-gray-800 text-gray-100 border-gray-700 focus:ring-2 focus:ring-teal-400"
                : "bg-white text-gray-800 border-gray-300 focus:ring-2 focus:ring-teal-500"
            }`}
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:opacity-90 transition"
          >
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 justify-center">
          <input
            type="text"
            placeholder="Filter by Author"
            value={filter.author}
            onChange={(e) => setFilter({ ...filter, author: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-teal-400"
          />
          <input
            type="number"
            placeholder="Filter by Year"
            value={filter.year}
            onChange={(e) => setFilter({ ...filter, year: e.target.value })}
            className="border border-gray-300 rounded-xl px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-teal-400"
          />
        </div>

        {/* Results */}
        {!loading && (
          <h2 className="text-2xl font-bold mb-4 text-center">
            {initialView ? "📖 Featured Books" : "🔍 Search Results"}
          </h2>
        )}

        {/* Books Grid */}
        <AnimatePresence>
          {!loading && filteredBooks.length > 0 && (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <motion.div
                  key={book.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className={`rounded-2xl p-4 shadow-lg border backdrop-blur-md cursor-pointer ${
                    darkMode ? "bg-gray-800/70 border-gray-700" : "bg-white/70 border-gray-200"
                  } transition`}
                  onClick={() => setSelectedBook(book)}
                >
                  {book.cover_i ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                      alt={book.title}
                      className="w-full h-64 object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg text-gray-400 text-sm">
                      No Cover
                    </div>
                  )}
                  <h2 className="text-lg font-semibold">{book.title}</h2>
                  <p className="text-sm text-gray-500">
                    {book.author_name?.join(", ") || "Unknown"}
                  </p>
                  <p className="text-xs mt-1 text-gray-400">
                    {book.first_publish_year || "N/A"}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <motion.div
              className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </div>
        )}

        {/* Book Modal */}
        <AnimatePresence>
          {selectedBook && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
            >
              <motion.div
                className={`p-6 rounded-2xl max-w-md w-11/12 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {selectedBook.cover_i && (
                  <img
                    src={`https://covers.openlibrary.org/b/id/${selectedBook.cover_i}-L.jpg`}
                    alt={selectedBook.title}
                    className="w-full h-72 object-cover rounded-lg mb-3"
                  />
                )}
                <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="text-sm mb-1">
                  👨‍💼 <strong>Author:</strong>{" "}
                  {selectedBook.author_name?.join(", ") || "Unknown"}
                </p>
                <p className="text-sm mb-1">
                  🗓️ <strong>Year:</strong> {selectedBook.first_publish_year || "N/A"}
                </p>
                <p className="text-sm mb-3">
                  🏷️ <strong>Edition:</strong> {selectedBook.edition_count || 0}
                </p>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => toggleFavorite(selectedBook)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                  >
                    {favorites.some((b) => b.key === selectedBook.key)
                      ? "🤍 Remove Favorite"
                      : "♥️ Add Favorite"}
                  </button>
                  <a
                    href={`https://openlibrary.org${selectedBook.key}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    View More
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to top */}
        {showScroll && (
          <motion.button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-teal-600 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition"
            whileTap={{ scale: 0.9 }}
          >
            ⬆️
          </motion.button>
        )}

        <footer className="text-center text-xs mt-16 text-gray-400">
          Data from{" "}
          <a
            href="https://openlibrary.org"
            target="_blank"
            rel="noreferrer"
            className="text-teal-500 hover:underline"
          >
            OpenLibrary.org
          </a>
        </footer>
      </div>
    </div>
  );
}

