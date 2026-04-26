import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TitleCard from '../components/TitleCard';
import LoadingSpinner from '../components/LoadingSpinner';
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

  useEffect(() => {
    performSearch();
  }, [query, type, genre, mood, page]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchTitles(query, type, genre, mood, page);
      console.log("API RESPONSE:", res.data);//added for debugging
      setResults(res.data.data.results);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (newFilters.type) params.set('type', newFilters.type);
    if (newFilters.genre) params.set('genre', newFilters.genre);
    navigate(`/search?${params.toString()}`);
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
          <option value="anime">Anime</option>
          <option value="book">Books</option>
          <option value="documentary">Documentaries</option>
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
        <LoadingSpinner />
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
                    handleFilterChange({ type, genre });
                    navigate(`/search?q=${query}&page=${newPage}`);
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
                    handleFilterChange({ type, genre });
                    navigate(`/search?q=${query}&page=${newPage}`);
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
