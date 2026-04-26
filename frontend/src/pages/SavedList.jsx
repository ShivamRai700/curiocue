import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleCard from '../components/TitleCard';
import { getSavedTitles, clearHistory } from '../utils/storage';

export default function SavedList() {
  const [saved, setSaved] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSaved(getSavedTitles());
  }, []);

  const handleRemove = (titleId) => {
    setSaved(saved.filter(t => t.id !== titleId));
  };

  if (saved.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">📭</div>
        <h1 className="text-3xl font-bold mb-4">Your list is empty</h1>
        <p className="text-slate-400 text-lg mb-8">
          Start exploring and save your favorite titles!
        </p>
        <button
          onClick={() => navigate('/search')}
          className="btn-primary"
        >
          🔍 Start Exploring
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">❤️ Your Saved List</h1>
        <span className="text-slate-400 text-lg">{saved.length} item(s)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {saved.map((title) => (
          <div
            key={title.id}
            onMouseLeave={() => setSaved([...getSavedTitles()])}
          >
            <TitleCard title={title} />
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => navigate('/search')}
          className="btn-secondary"
        >
          Explore More
        </button>
      </div>
    </div>
  );
}
