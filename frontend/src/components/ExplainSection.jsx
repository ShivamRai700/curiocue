import React, { useState } from 'react';

export default function ExplainSection({ explanations }) {
  const [expandedWord, setExpandedWord] = useState(null);
  const [showThemes, setShowThemes] = useState(true);

  if (!explanations) {
    return (
      <div className="card p-6 text-center text-slate-400">
        👆 Click <span className="text-indigo-400 font-semibold">“Explain Better”</span> to unlock insights
      </div>
    );
  }

  // ✅ SAFE NORMALIZATION
  const themes = Array.isArray(explanations.themes)
    ? explanations.themes
    : explanations.themes
    ? [explanations.themes]
    : [];

  const trickyWords = Array.isArray(explanations.trickyWords)
    ? explanations.trickyWords
    : [];

  return (
    <div className="space-y-6">

      {/* THEMES */}
      {themes.length > 0 && (
        <SectionToggle
          title="🎭 What’s really going on"
          open={showThemes}
          toggle={() => setShowThemes(!showThemes)}
        >
          <ul className="space-y-3">
            {themes.map((theme, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-lg">•</span>
                <span className="text-slate-200">{theme}</span>
              </li>
            ))}
          </ul>
        </SectionToggle>
      )}

      {/* TRICKY WORDS */}
      {trickyWords.length > 0 && (
        <div className="card p-6">
          <h3 className="text-2xl font-bold mb-4">
            📚 Things you might not get
          </h3>

          <div className="space-y-3">
            {trickyWords.map((item, i) => (
              <div
                key={i}
                className="bg-slate-800 rounded-xl p-4 cursor-pointer hover:bg-slate-700 transition"
                onClick={() => setExpandedWord(expandedWord === i ? null : i)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-300">
                    {item.word || "Unknown"}
                  </span>
                  <span className="text-xl">
                    {expandedWord === i ? '−' : '+'}
                  </span>
                </div>

                {expandedWord === i && (
                  <p className="mt-3 text-slate-300">
                    {item.explanation || "No explanation available"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!themes.length && !trickyWords.length && (
        <div className="text-center text-slate-400 py-6">
          No insights available yet.
        </div>
      )}

    </div>
  );
}

/* ---------- TOGGLE ---------- */

function SectionToggle({ title, open, toggle, children }) {
  return (
    <div className="card p-6">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between hover:text-indigo-300 transition mb-4"
      >
        <h3 className="text-2xl font-bold">{title}</h3>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && <div>{children}</div>}
    </div>
  );
}