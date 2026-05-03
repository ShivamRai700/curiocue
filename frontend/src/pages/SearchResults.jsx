import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TitleCard from "../components/TitleCard";
import { handleApiError, searchTitles } from "../utils/api";

const TYPE_OPTIONS = [
  { value: "", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "series", label: "Series" },
  { value: "anime", label: "Anime" },
  { value: "book", label: "Books" },
];

const TYPE_ORDER = { movie: 0, series: 1, anime: 2, book: 3 };

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const genre = searchParams.get("genre") || "";
  const mood = searchParams.get("mood") || "";
  const page = searchParams.get("page") || "1";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const skeletonCards = useMemo(() => Array.from({ length: 8 }), []);

  useEffect(() => {
    performSearch();
  }, [query, genre, mood, page]);

  useEffect(() => {
    setTypeFilter(type || "all");
  }, [type]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await searchTitles(query, "", genre, mood, page);
      const responseData = res?.data?.data;

      if (!responseData || !Array.isArray(responseData.results)) {
        throw new Error("Unexpected API response");
      }

      const sortedResults = [...responseData.results].sort((a, b) => {
        const left = TYPE_ORDER[a.type] ?? 99;
        const right = TYPE_ORDER[b.type] ?? 99;
        return left - right;
      });

      setResults(sortedResults);
      setPagination(responseData.pagination || null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const normalizedResults = results.map((item) => ({
    ...item,
    type: item.type?.toLowerCase() || "",
  }));

  const books = normalizedResults
    .filter((item) => item.type === "book")
    .sort(
      (a, b) =>
        (b.score || b.relevance || 0) -
        (a.score || a.relevance || 0)
    );

  const bestBook = books.length > 0 ? books[0] : null;
  const nonBooks = normalizedResults.filter(
    (item) => item.type !== "book"
  );

  const finalResults = bestBook
    ? [...nonBooks, bestBook]
    : nonBooks;

  const filteredResults = finalResults.filter((item) => {
    if (typeFilter === "all") return true;
    return item.type === typeFilter;
  });

  const buildSearchUrl = ({
    q = query,
    type: searchType = type,
    genre: searchGenre = genre,
    mood: searchMood = mood,
    page: searchPage = page,
  }) => {
    const params = new URLSearchParams();

    if (q) params.set("q", q);
    if (searchType) params.set("type", searchType);
    if (searchGenre) params.set("genre", searchGenre);
    if (searchMood) params.set("mood", searchMood);
    if (searchPage && searchPage !== "1")
      params.set("page", searchPage);

    return `/search${
      params.toString() ? `?${params.toString()}` : ""
    }`;
  };

  const handleFilterChange = (newFilters) => {
    navigate(
      buildSearchUrl({
        type: newFilters.type ?? type,
        genre: newFilters.genre ?? genre,
        mood: newFilters.mood ?? mood,
        page: "1",
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {query ? `Results for "${query}"` : "Browse All"}
        </h1>
        <p className="text-slate-400">
          {pagination
            ? `Found ${pagination.total} results`
            : "Searching across titles"}
        </p>
      </div>

      {/* FILTERS */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        >
          {TYPE_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={genre}
          onChange={(e) =>
            handleFilterChange({ genre: e.target.value })
          }
          className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white"
        >
          <option value="">All Genres</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="fantasy">Fantasy</option>
          <option value="horror">Horror</option>
          <option value="thriller">Thriller</option>
        </select>

        {(query || type || genre) && (
          <button
            onClick={() => {
              setTypeFilter("all");
              navigate("/search");
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* ERROR */}
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={performSearch} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : loading ? (
        /* LOADING SKELETON */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {skeletonCards.map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-3xl bg-slate-900 overflow-hidden shadow-lg flex flex-col"
            >
              <div className="aspect-[2/3] bg-slate-800" />

              <div className="p-4 space-y-3 flex flex-col flex-grow">
                <div className="h-6 w-3/4 rounded bg-slate-700" />
                <div className="h-4 w-1/2 rounded bg-slate-700" />

                <div className="mt-auto flex gap-2">
                  <div className="h-10 flex-1 rounded bg-slate-800" />
                  <div className="h-10 flex-1 rounded bg-slate-800" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredResults.length === 0 ? (
        /* EMPTY */
        <div className="text-center py-12">
          <p className="text-xl text-slate-400 mb-6">
            No results found. Try a different search.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      ) : (
        /* RESULTS */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {filteredResults.map((title) => (
              <TitleCard
                key={`${title.type}-${title.id}`}
                title={title}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {pagination &&
            (pagination.hasMore || parseInt(page, 10) > 1) && (
              <div className="flex justify-center gap-4 mt-8">
                {parseInt(page, 10) > 1 && (
                  <button
                    onClick={() => {
                      const newPage = parseInt(page, 10) - 1;
                      navigate(
                        buildSearchUrl({ page: String(newPage) })
                      );
                    }}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                )}

                <span className="py-3 px-6 text-slate-300">
                  Page {page}
                </span>

                {pagination.hasMore && (
                  <button
                    onClick={() => {
                      const newPage = parseInt(page, 10) + 1;
                      navigate(
                        buildSearchUrl({ page: String(newPage) })
                      );
                    }}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
        </>
      )}
    </div>
  );
}