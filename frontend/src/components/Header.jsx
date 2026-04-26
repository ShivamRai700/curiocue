import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSavedTitles } from '../utils/storage';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedCount, setSavedCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setSavedCount(getSavedTitles().length);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="text-2xl">🎬</div>
          <h1 className="font-bold text-xl gradient-text hidden sm:block">CurioCue</h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          <Link
            to="/saved"
            className="p-2 rounded-lg hover:bg-slate-700 transition relative group"
            title="Saved Items"
          >
            <span className="text-xl">❤️</span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
