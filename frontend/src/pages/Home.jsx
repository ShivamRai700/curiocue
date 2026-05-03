import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TitleCard from "../components/TitleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  getRecommendations,
  getSearchSuggestions,
  handleApiError,
} from "../utils/api";

export default function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchTrending();
  }, []);

  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await getSearchSuggestions(search.trim());
        const data = res?.data?.data?.suggestions || [];
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch (_) {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getRecommendations(null, null, 12);
      const data = res?.data?.data?.recommendations || [];

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      setTrending(data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const q = search.trim();
    if (!q) return;

    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion.title);
    setShowSuggestions(false);
    navigate(`/title/${suggestion.type}/${suggestion.id}`);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* HERO */}
      <section className="py-24 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 gradient-text">
          CurioCue
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10">
          Discover movies, series, and anime worth watching.
        </p>

        {/* SEARCH */}
        <div className="max-w-xl mx-auto relative">
          <form onSubmit={handleSearch} className="flex items-stretch gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="Search movies, series, anime, books..."
                className="w-full h-12 px-5 rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-indigo-500"
              />

              {/* SUGGESTIONS DROPDOWN */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id}`}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-slate-700 transition flex items-center gap-3 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {suggestion.image && (
                        <img
                          src={suggestion.image}
                          alt={suggestion.title}
                          className="w-8 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="text-white font-medium">
                          {suggestion.title}
                        </div>
                        <div className="text-slate-400 text-sm">
                          {suggestion.year && `${suggestion.year} • `}
                          {suggestion.type === "movie" ? "Movie" : "TV Show"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary h-12 px-6 flex items-center justify-center">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* TRENDING SECTION */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Now</h2>

          <button
            onClick={fetchTrending}
            className="text-sm text-slate-400 hover:text-white"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : trending.length === 0 ? (
          <div className="text-center text-slate-400">No results available</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trending.map((item) => (
              <TitleCard key={item.id} title={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
