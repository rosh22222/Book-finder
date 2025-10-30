// src/components/BookList.jsx
import React from "react";
import BookCard from "./BookCard";

export default function BookList({ books }) {
  if (!books || books.length === 0) {
    return <div className="text-center text-gray-500 py-16">No results yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {books.map((b) => (
        <BookCard key={b.key} book={b} />
      ))}
    </div>
  );
}
