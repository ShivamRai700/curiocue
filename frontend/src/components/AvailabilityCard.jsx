import React, { useEffect, useState } from 'react';
import { getAvailability, handleApiError } from '../utils/api';

const platformIcons = {
  Netflix: '🎬',
  'Amazon Prime': '🎥',
  'Disney+': '✨',
  Hotstar: '📺',
  YouTube: '📹',
  'Apple TV': '🍎',
  Kindle: '📖',
  Audible: '🎧',
  Bookshelf: '📚',
  Library: '📚',
  Crunchyroll: '⛩️'
};

export default function AvailabilityCard({ titleId }) {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [region, setRegion] = useState('IN'); // better default for you

  useEffect(() => {
    fetchAvailability();
  }, [titleId, region]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAvailability(titleId, region);
      setAvailability(res.data?.data || null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading state (clean)
  if (loading) {
    return (
      <div className="card p-6 text-center text-slate-400">
        🔎 Checking where you can watch this...
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="card p-6 text-center text-red-400">
        ⚠️ {error}
      </div>
    );
  }

  // ✅ Empty state (VERY important UX)
  if (!availability) {
    return (
      <div className="card p-6 text-center text-slate-400">
        No availability info yet.
      </div>
    );
  }

  const options = availability.options || {};

  return (
    <div className="card p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">📺 Where to Watch / Read</h3>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:border-indigo-500"
        >
          <option value="IN">India</option>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
        </select>
      </div>

      {/* SECTIONS */}
      <Section title="✅ Free" data={options.free} />
      <Section title="📺 Free with Ads" data={options.freeWithAds} />
      <Section title="🎭 Subscription" data={options.subscription} />
      <Section title="💳 Buy / Rent" data={options.buyOrRent} />

      {/* FALLBACK */}
      {!hasAnyOptions(options) && (
        <div className="text-center text-slate-400 py-6">
          No official platforms found for this region 😔
        </div>
      )}

      {/* DISCLAIMER */}
      {availability.disclaimer && (
        <div className="text-xs text-slate-400 pt-4 border-t border-slate-700">
          ⚠️ {availability.disclaimer}
        </div>
      )}
    </div>
  );
}

/* ---------- SECTION COMPONENT ---------- */

function Section({ title, data }) {
  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <div>
      <h4 className="text-lg font-semibold mb-3 text-indigo-300">{title}</h4>

      <div className="grid sm:grid-cols-2 gap-3">
        {data.map((opt, i) => (
          <AvailabilityOption key={i} option={opt} />
        ))}
      </div>
    </div>
  );
}

/* ---------- OPTION CARD ---------- */

function AvailabilityOption({ option }) {
  const name = option?.name || "Unknown";
  const url = option?.url || "#";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition group"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {platformIcons[name] || '🎬'}
        </span>

        <div>
          <p className="font-semibold group-hover:text-indigo-300">
            {name}
          </p>

          <p className="text-xs text-slate-400">
            {option?.quality || option?.price || "Available"}
          </p>
        </div>
      </div>

      <span className="text-sm text-indigo-400 group-hover:underline">
        Open →
      </span>
    </a>
  );
}

/* ---------- HELPER ---------- */

function hasAnyOptions(options) {
  return (
    options?.free?.length ||
    options?.freeWithAds?.length ||
    options?.subscription?.length ||
    options?.buyOrRent?.length
  );
}