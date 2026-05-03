import React from "react";
import { Link } from "react-router-dom";

import {
  saveTitleToList,
  removeTitleFromList,
  isTitleSaved,
} from "../utils/storage";
import { shareNative } from "../utils/shareUtils";
import { BOOK_PLACEHOLDER_IMAGE, getBookImageCandidates } from "../utils/books";

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
  if (title.type === "book") {
    return `/book/${title.id}`;
  }

  if (title.type === "anime") {
    return `/title/series/${title.id}`;
  }

  return title.type
    ? `/title/${title.type}/${title.id}`
    : `/title/movie/${title.id}`;
};

export default function TitleCard({ title, showActions = true }) {
  const [isSaved, setIsSaved] = React.useState(isTitleSaved(title.id));

  const handleSave = (event) => {
    event.preventDefault();

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

  const displayTitle = title.title || "Unknown Title";
  const typeLabel = getTypeLabel(title);
  const imageCandidates = React.useMemo(
    () =>
      title.type === "book"
        ? getBookImageCandidates(title)
        : [title.image, FALLBACK_IMAGE].filter(Boolean),
    [title],
  );
  const [cardImage, setCardImage] = React.useState(
    imageCandidates[0] || FALLBACK_IMAGE,
  );
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

  React.useEffect(() => {
    setCardImage(
      imageCandidates[0] ||
        (title.type === "book" ? BOOK_PLACEHOLDER_IMAGE : FALLBACK_IMAGE),
    );
  }, [imageCandidates, title.type]);

  return (
    <Link
      to={getTypeRoute(title)}
      className="card card-hover overflow-hidden group transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="card-image relative">
        <img
          src={
            cardImage && cardImage.trim() !== "" ? cardImage : FALLBACK_IMAGE
          }
          alt={displayTitle}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onLoad={(e) => {
            const img = e.target;
            const ratio = img.naturalWidth / img.naturalHeight;

            // 🚨 If image is too wide → it's NOT a real book cover
            if (ratio > 1.2) {
              img.src = BOOK_PLACEHOLDER_IMAGE;
            }
          }}
          onError={(event) => {
            event.target.onerror = null;

            const currentIndex = imageCandidates.indexOf(cardImage);
            const nextImage = imageCandidates[currentIndex + 1];

            event.target.src =
              nextImage ||
              (title.type === "book" ? BOOK_PLACEHOLDER_IMAGE : FALLBACK_IMAGE);

            if (nextImage) {
              setCardImage(nextImage);
            }
          }}
        />
        {typeLabel && (
          <div className="absolute top-3 left-3 badge">{typeLabel}</div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="card-content">
          <h3 className="font-bold text-lg mb-2 text-white group-hover:text-indigo-300 transition truncate-lines-2">
            {displayTitle}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {typeLabel && (
              <span className="text-xs font-medium uppercase tracking-wide text-indigo-300">
                {typeLabel}
              </span>
            )}
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

          {title.type === "book" && bookAuthors && (
            <p className="text-sm text-slate-300 mb-3 truncate-lines-2">
              {bookAuthors}
            </p>
          )}

          {Array.isArray(title.genre) && title.genre.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {title.genre.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-xs text-slate-400 truncate max-w-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>

        {showActions && (
          <div className="card-actions pt-3 border-t border-slate-700">
            <button
              onClick={handleSave}
              className="card-action-button bg-slate-700 hover:bg-slate-600 text-sm font-medium"
              title={isSaved ? "Remove from saved list" : "Save this title"}
            >
              {isSaved ? "Remove" : "Save"}
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                shareNative(title);
              }}
              className="card-action-button bg-slate-700 hover:bg-slate-600 text-sm font-medium"
              title="Share"
            >
              Share
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
