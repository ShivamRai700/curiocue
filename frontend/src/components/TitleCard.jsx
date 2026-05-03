import React from "react";
import { Link } from "react-router-dom";

import {
  saveTitleToList,
  removeTitleFromList,
  isTitleSaved,
} from "../utils/storage";
import { shareNative } from "../utils/shareUtils";
import {
  BOOK_PLACEHOLDER_IMAGE,
  getBookImageCandidates,
} from "../utils/books";

const FALLBACK_IMAGE = "https://placehold.co/500x750?text=No+Image";

const getTypeLabel = (title) => {
  if (title.typeLabel) return title.typeLabel;

  const labels = {
    movie: "Movie",
    series: "Series",
    anime: "Anime",
    book: "Book",
    documentary: "Documentary",
  };

  return labels[title.type] || null;
};

const getTypeRoute = (title) => {
  if (title.type === "book") return `/book/${title.id}`;
  if (title.type === "anime") return `/title/series/${title.id}`;
  return title.type
    ? `/title/${title.type}/${title.id}`
    : `/title/movie/${title.id}`;
};

export default function TitleCard({ title, showActions = true }) {
  const [isSaved, setIsSaved] = React.useState(
    isTitleSaved(title.id)
  );

  const displayTitle = title.title || "Unknown Title";
  const typeLabel = getTypeLabel(title);

  const imageCandidates = React.useMemo(
    () =>
      title.type === "book"
        ? getBookImageCandidates(title)
        : [title.image, FALLBACK_IMAGE].filter(Boolean),
    [title]
  );

  const [cardImage, setCardImage] = React.useState(
    imageCandidates[0] ||
      (title.type === "book"
        ? BOOK_PLACEHOLDER_IMAGE
        : FALLBACK_IMAGE)
  );

  React.useEffect(() => {
    setCardImage(
      imageCandidates[0] ||
        (title.type === "book"
          ? BOOK_PLACEHOLDER_IMAGE
          : FALLBACK_IMAGE)
    );
  }, [imageCandidates, title.type]);

  const handleSave = (e) => {
    e.preventDefault();

    if (isSaved) {
      removeTitleFromList(title.id);
    } else {
      saveTitleToList(title);
    }

    setIsSaved(!isSaved);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-400";
    if (rating >= 7) return "text-yellow-400";
    return "text-orange-400";
  };

  const metadata = [
    title.type === "book"
      ? title.publishedDate
        ? `Published: ${title.publishedDate}`
        : title.year
        ? `Published: ${title.year}`
        : null
      : title.year
      ? `Year: ${title.year}`
      : null,
    typeof title.rating === "number" && title.rating > 0
      ? `Rating: ${title.rating.toFixed(1)}`
      : null,
  ].filter(Boolean);

  const bookAuthors = Array.isArray(title.authors)
    ? title.authors.slice(0, 2).join(", ")
    : "";

  return (
    <Link
      to={getTypeRoute(title)}
      className="card flex flex-col overflow-hidden rounded-3xl bg-slate-900 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
    >
      {/* IMAGE */}
      <div className="card-image aspect-[2/3] bg-slate-700 overflow-hidden">
        <img
          src={cardImage}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            const index = imageCandidates.indexOf(cardImage);
            const next = imageCandidates[index + 1];
            e.target.src =
              next ||
              (title.type === "book"
                ? BOOK_PLACEHOLDER_IMAGE
                : FALLBACK_IMAGE);
            if (next) setCardImage(next);
          }}
        />

        {typeLabel && (
          <div className="absolute top-3 left-3 badge">
            {typeLabel}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 text-white truncate-lines-2">
          {displayTitle}
        </h3>

        {/* METADATA */}
        <div className="flex flex-wrap gap-2 mb-3">
          {metadata.map((item) => (
            <span
              key={item}
              className={`text-xs font-medium ${
                item.startsWith("Rating:")
                  ? getRatingColor(title.rating)
                  : "text-slate-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* AUTHORS (BOOKS ONLY) */}
        {title.type === "book" && bookAuthors && (
          <p className="text-sm text-slate-300 mb-3 truncate-lines-2">
            {bookAuthors}
          </p>
        )}

        {/* GENRES */}
        {Array.isArray(title.genre) &&
          title.genre.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {title.genre.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-xs text-slate-400"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

        {/* ACTIONS */}
        {showActions && (
          <div className="card-actions mt-auto pt-3 border-t border-slate-700 flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-sm font-medium py-2 rounded"
            >
              {isSaved ? "Saved" : "Save"}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                shareNative(title);
              }}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-sm font-medium py-2 rounded"
            >
              Share
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}