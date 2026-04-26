import React from "react";
import { Link } from "react-router-dom";

import {
  saveTitleToList,
  removeTitleFromList,
  isTitleSaved,
} from "../utils/storage";
import { shareNative, shareToTwitter } from "../utils/shareUtils";

export default function TitleCard({ title, showActions = true }) {
  const [isSaved, setIsSaved] = React.useState(isTitleSaved(title.id));

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

  const getTypeEmoji = (type) => {
    const emojis = {
      movie: "🎬",
      series: "📺",
      anime: "✨",
      book: "📚",
      documentary: "🎥",
    };
    return emojis[type] || "🎬";
  };

  return (
    <Link
      to={`/title/${title.id}`}
      className="card card-hover overflow-hidden group"
    >
      <div className="relative overflow-hidden h-96 bg-slate-700">
        {/* Image */}
        <img
          src={
            title.image && title.image.trim() !== ""
              ? title.image
              : "https://placehold.co/500x750?text=No+Image"
          }
          alt={title.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/500x750?text=No+Image";
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getTypeEmoji(title.type)}</span>
              {title.year && (
                <span className="text-sm text-slate-300">{title.year}</span>
              )}
            </div>
          </div>

          {/* Rating */}
          {title.rating && (
            <div
              className={`text-lg font-bold ${getRatingColor(title.rating)}`}
            >
              ⭐ {title.rating.toFixed(1)}
            </div>
          )}
        </div>

        {/* Badge */}
        {title.type && (
          <div className="absolute top-3 left-3 badge">{title.type}</div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-40">
        <h3 className="font-bold text-lg mb-2 truncate group-hover:text-indigo-300 transition">
          {title.title}
        </h3>

        {title.genre && (
          <div className="flex flex-wrap gap-1 mb-3">
            {title.genre.slice(0, 2).map((g, i) => (
              <span key={i} className="text-xs text-slate-400">
                {g}
              </span>
            ))}
          </div>
        )}

        <p className="text-slate-300 text-sm truncate-lines-2 mb-3 flex-1">
          {title.summary || title.plot}
        </p>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-3 border-t border-slate-700">
            <button
              onClick={handleSave}
              className="flex-1 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition text-sm font-medium"
              title={isSaved ? "Remove from saved" : "Save"}
            >
              {isSaved ? "❤️ Saved" : "🤍 Save"}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                shareNative(title);
              }}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition"
              title="Share"
            >
              📤
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
