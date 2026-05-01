import React, { useState } from 'react';

export default function ExplainSection({ explanations }) {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!explanations) {
    return (
      <div className="card p-6 text-center text-slate-400">
        👆 Click <span className="text-indigo-400 font-semibold">“Explain Better”</span> to unlock insights
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* SUMMARY */}
      {explanations.summary && (
        <SectionToggle
          title="📖 Story Summary"
          open={expandedSection === 'summary'}
          toggle={() => setExpandedSection(expandedSection === 'summary' ? null : 'summary')}
        >
          <p className="text-slate-200 leading-relaxed">
            {explanations.summary}
          </p>
        </SectionToggle>
      )}

      {/* THEMES */}
      {explanations.themes && explanations.themes.length > 0 && (
        <SectionToggle
          title="🎭 Key Themes"
          open={expandedSection === 'themes'}
          toggle={() => setExpandedSection(expandedSection === 'themes' ? null : 'themes')}
        >
          <ul className="space-y-3">
            {explanations.themes.map((theme, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-indigo-400 font-semibold">•</span>
                <span className="text-slate-200">{theme}</span>
              </li>
            ))}
          </ul>
        </SectionToggle>
      )}

      {/* WHY WORTH IT */}
      {explanations.whyWorthIt && (
        <SectionToggle
          title="⭐ Why It's Worth Watching"
          open={expandedSection === 'worth'}
          toggle={() => setExpandedSection(expandedSection === 'worth' ? null : 'worth')}
        >
          <p className="text-slate-200 leading-relaxed">
            {explanations.whyWorthIt}
          </p>
        </SectionToggle>
      )}

      {/* EMPTY STATE */}
      {!explanations.summary && (!explanations.themes || explanations.themes.length === 0) && !explanations.whyWorthIt && (
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