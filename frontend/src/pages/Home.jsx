import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleCard from '../components/TitleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getRecommendations, handleApiError } from '../utils/api';

export default function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 fetch trending ONCE
  useEffect(() => {
    fetchTrending();
  }, []);

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

  // 🔍 SEARCH (fully dynamic)
  const handleSearch = (e) => {
    e.preventDefault();

    const q = search.trim();

    if (!q) return;

    navigate(`/search?q=${encodeURIComponent(q)}&type=movie`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">

      {/* HERO */}
      <section className="py-24 px-4 text-center">

        <h1 className="text-5xl md:text-7xl font-black mb-6 gradient-text">
          CurioCue
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10">
          Search any movie. Discover what’s actually worth watching.
        </p>

        {/* SEARCH */}
        <form
          onSubmit={handleSearch}
          className="max-w-xl mx-auto flex gap-3"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movie name..."
            className="flex-1 px-5 py-3 rounded-xl bg-slate-800 border border-slate-600 text-white focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="btn-primary px-6"
          >
            Search
          </button>
        </form>

        

      </section>

      {/* TRENDING SECTION */}
      <section className="px-4 pb-16 max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Trending Now
          </h2>

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
          <div className="text-center text-red-400">
            {error}
          </div>
        ) : trending.length === 0 ? (
          <div className="text-center text-slate-400">
            No results available
          </div>
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