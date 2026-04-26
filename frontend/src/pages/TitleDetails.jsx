import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getTitleDetails,
  getSimilarTitles,
  handleApiError,
  getAIExplanation
} from '../utils/api';

import {
  saveTitleToList,
  removeTitleFromList,
  isTitleSaved,
  addToHistory
} from '../utils/storage';

import {
  shareNative,
  copyToClipboard
} from '../utils/shareUtils';

import LoadingSpinner from '../components/LoadingSpinner';
import AvailabilityCard from '../components/AvailabilityCard';
import ExplainSection from '../components/ExplainSection';
import TitleCard from '../components/TitleCard';

export default function TitleDetails() {
  const { id } = useParams();

  const [title, setTitle] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [explanations, setExplanations] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingExplain, setLoadingExplain] = useState(false);

  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const [titleRes, similarRes] = await Promise.all([
        getTitleDetails(id),
        getSimilarTitles(id)
      ]);

      const titleData = titleRes.data.data;

      setTitle(titleData);
      setSimilar(similarRes.data.data.similar || []);
      setIsSaved(isTitleSaved(id));

      addToHistory(titleData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // 🔥 AI EXPLAIN
  const handleExplain = async () => {
    if (!title || loadingExplain) return;

    try {
      setLoadingExplain(true);

      const res = await getAIExplanation(
        title.title,
        title.summary || title.plot,
        id
      );

      setExplanations(res.data.data);
    } catch (err) {
      console.error("Explain failed:", err);
    } finally {
      setLoadingExplain(false);
    }
  };

  const handleSave = () => {
    if (isSaved) {
      removeTitleFromList(id);
    } else {
      saveTitleToList(title);
    }
    setIsSaved(!isSaved);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(title);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-red-400">
        {error}
      </div>
    );
  }

  if (!title) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-slate-400">
        Title not found
      </div>
    );
  }

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-green-400';
    if (rating >= 7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* HERO */}
      <div className="grid md:grid-cols-3 gap-8">

        <div>
          <img
            src={title.image}
            alt={title.title}
            className="w-full rounded-xl shadow-2xl"
          />
        </div>

        <div className="md:col-span-2 flex flex-col justify-between">
          <div>

            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {title.title}
                </h1>

                <div className="flex items-center gap-4 text-slate-400">
                  {title.year && <span>{title.year}</span>}
                  {title.duration && <span>{title.duration} min</span>}
                </div>
              </div>

              {title.rating && (
                <div className={`text-4xl font-bold ${getRatingColor(title.rating)}`}>
                  ⭐ {title.rating.toFixed(1)}
                </div>
              )}
            </div>

            {/* GENRES */}
            {title.genre && (
              <div className="mb-6 flex flex-wrap gap-2">
                {title.genre.map((g, i) => (
                  <span key={i} className="badge">{g}</span>
                ))}
              </div>
            )}

            {/* SUMMARY */}
            <p className="text-lg text-slate-300 mb-6">
              {title.summary}
            </p>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={handleSave} className="btn-primary">
              {isSaved ? '❤️ Saved' : '🤍 Save'}
            </button>

            <button onClick={() => shareNative(title)} className="btn-secondary">
              📤 Share
            </button>

            <button onClick={handleCopy} className="btn-secondary">
              {copied ? '✅ Copied!' : '📋 Copy Link'}
            </button>

            {/* 🔥 AI BUTTON */}
            <button
              onClick={handleExplain}
              className="btn-primary bg-indigo-600 hover:bg-indigo-500"
            >
              🤔 Explain Better
            </button>
          </div>

          {loadingExplain && (
            <p className="mt-4 text-indigo-400">
              Thinking... 🧠
            </p>
          )}

        </div>
      </div>

      {/* AI EXPLANATION */}
      {explanations && (
        <ExplainSection explanations={explanations} />
      )}

      {/* AVAILABILITY */}
      <AvailabilityCard titleId={id} title={title.title} />

      {/* SIMILAR */}
      {similar.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6">
            🎬 Similar Titles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similar.map((t) => (
              <TitleCard key={t.id} title={t} showActions={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}