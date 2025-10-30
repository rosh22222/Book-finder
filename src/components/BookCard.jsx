// src/components/BookCard.jsx
import React from "react";

export default function BookCard({ book }) {
  // OpenLibrary cover: https://covers.openlibrary.org/b/id/{cover_i}-M.jpg
  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  return (
    <div className="flex gap-4 p-4 border rounded-md items-start bg-white shadow-sm">
      <div className="w-24 flex-shrink-0">
        {coverUrl ? (
          <img src={coverUrl} alt={book.title} className="w-24 h-32 object-cover rounded" />
        ) : (
          <div className="w-24 h-32 bg-gray-100 flex items-center justify-center rounded text-sm text-gray-500">
            No Cover
          </div>
        )}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{book.title}</h3>
        {book.author_name && <p className="text-sm text-gray-600">by {book.author_name.join(", ")}</p>}
        <p className="text-sm text-gray-500 mt-1">
          First published: {book.first_publish_year ?? "N/A"}
        </p>
        {book.subject && (
          <div className="mt-2 text-xs text-gray-600">
            Subjects: {book.subject.slice(0, 5).join(", ")}
          </div>
        )}
        <a
          className="inline-block mt-3 text-indigo-600 text-sm"
          href={`https://openlibrary.org${book.key}`}
          target="_blank"
          rel="noreferrer"
        >
          View on OpenLibrary
        </a>
      </div>
    </div>
  );
}
