// src/components/SearchBar.jsx
import React from "react";

export default function SearchBar({ value, onChange, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex gap-2 items-center w-full"
    >
      <input
        type="text"
        placeholder="Search books by title, author, ISBN..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}
