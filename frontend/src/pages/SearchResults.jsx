import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TitleCard from '../components/TitleCard';
import { searchTitles, handleApiError } from '../utils/api';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || '';
  const genre = searchParams.get('genre') || '';
  const mood = searchParams.get('mood') || '';
  const page = searchParams.get('page') || '1';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const skeletonCards = useMemo(() => Array.from({ length: 8 }), []);

  useEffect(() => {
    performSearch();
  }, [query, type, genre, mood, page]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchTitles(query, type, genre, mood, page);
      const responseData = res?.data?.data;

      if (!responseData || !Array.isArray(responseData.results)) {
        throw new Error('Unexpected API response');
      }

      setResults(responseData.results);
      setPagination(responseData.pagination || null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const buildSearchUrl = ({ q = query, type: searchType = type, genre: searchGenre = genre, mood: searchMood = mood, page: searchPage = page }) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (searchType) params.set('type', searchType);
    if (searchGenre) params.set('genre', searchGenre);
    if (searchMood) params.set('mood', searchMood);
    if (searchPage) params.set('page', searchPage);
    return `/search?${params.toString()}`;
  };

  const handleFilterChange = (newFilters) => {
    const nextType = newFilters.type ?? type;
    const nextGenre = newFilters.genre ?? genre;
    const nextMood = newFilters.mood ?? mood;
    navigate(buildSearchUrl({ type: nextType, genre: nextGenre, mood: nextMood, page: '1' }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {query ? `Results for "${query}"` : 'Browse All'}
        </h1>
        <p className="text-slate-400">
          {pagination && `Found ${pagination.total} results`}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <select
          value={type}
          onChange={(e) => handleFilterChange({ type: e.target.value, genre })}
          className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-indigo-500"
        >
          <option value="">All Types</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
        </select>

        <select
          value={genre}
          onChange={(e) => handleFilterChange({ type, genre: e.target.value })}
          className="px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-indigo-500"
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
            onClick={() => navigate('/search')}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      {error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={performSearch} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {skeletonCards.map((_, index) => (
            <div key={index} className="animate-pulse rounded-3xl bg-slate-900 overflow-hidden shadow-lg">
              <div className="h-96 bg-slate-800" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 rounded bg-slate-700" />
                <div className="h-4 w-1/2 rounded bg-slate-700" />
                <div className="h-10 rounded bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-slate-400 mb-6">
            No results found. Try a different search!
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {results.map((title) => (
              <TitleCard key={title.id} title={title} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && (pagination.hasMore || parseInt(page) > 1) && (
            <div className="flex justify-center gap-4 mt-8">
              {parseInt(page) > 1 && (
                <button
                  onClick={() => {
                    const newPage = parseInt(page) - 1;
                    navigate(buildSearchUrl({ page: String(newPage) }));
                  }}
                  className="btn-secondary"
                >
                  ← Previous
                </button>
              )}

              <span className="py-3 px-6 text-slate-300">
                Page {page}
              </span>

              {pagination.hasMore && (
                <button
                  onClick={() => {
                    const newPage = parseInt(page) + 1;
                    navigate(buildSearchUrl({ page: String(newPage) }));
                  }}
                  className="btn-secondary"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
