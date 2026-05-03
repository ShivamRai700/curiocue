import React, { useState } from "react";

const getCopy = (contentType) => {
  if (contentType === "book") {
    return {
      empty: 'Click "Explain Better" to unlock book insights.',
      summary: "Summary",
      themes: "Themes",
      worth: "Why It's Worth Reading",
      tone: "Reading Style",
    };
  }

  return {
    empty: 'Click "Explain Better" to unlock insights.',
    summary: "Story Summary",
    themes: "Key Themes",
    worth: "Why It's Worth Watching",
    tone: "Tone and Style",
  };
};

export default function ExplainSection({ explanations, contentType = "movie" }) {
  const [expandedSection, setExpandedSection] = useState("summary");
  const copy = getCopy(contentType);

  if (!explanations) {
    return (
      <div className="card p-6 text-center text-slate-400">
        {copy.empty}
      </div>
    );
  }

  const hasThemes = Array.isArray(explanations.themes) && explanations.themes.length > 0;
  const toneValue = explanations.readingStyle || explanations.tone;

  return (
    <div className="space-y-6">
      {explanations.summary && (
        <SectionToggle
          title={copy.summary}
          open={expandedSection === "summary"}
          toggle={() => setExpandedSection(expandedSection === "summary" ? null : "summary")}
        >
          <p className="text-slate-200 leading-relaxed">{explanations.summary}</p>
        </SectionToggle>
      )}

      {hasThemes && (
        <SectionToggle
          title={copy.themes}
          open={expandedSection === "themes"}
          toggle={() => setExpandedSection(expandedSection === "themes" ? null : "themes")}
        >
          <ul className="space-y-3">
            {explanations.themes.map((theme) => (
              <li key={theme} className="flex items-start gap-3">
                <span className="text-indigo-400 font-semibold">•</span>
                <span className="text-slate-200">{theme}</span>
              </li>
            ))}
          </ul>
        </SectionToggle>
      )}

      {explanations.whyWorthIt && (
        <SectionToggle
          title={copy.worth}
          open={expandedSection === "worth"}
          toggle={() => setExpandedSection(expandedSection === "worth" ? null : "worth")}
        >
          <p className="text-slate-200 leading-relaxed">{explanations.whyWorthIt}</p>
        </SectionToggle>
      )}

      {toneValue && (
        <SectionToggle
          title={copy.tone}
          open={expandedSection === "tone"}
          toggle={() => setExpandedSection(expandedSection === "tone" ? null : "tone")}
        >
          <p className="text-slate-200 leading-relaxed">{toneValue}</p>
        </SectionToggle>
      )}

      {!explanations.summary && !hasThemes && !explanations.whyWorthIt && !toneValue && (
        <div className="text-center text-slate-400 py-6">
          No insights available yet.
        </div>
      )}
    </div>
  );
}

function SectionToggle({ title, open, toggle, children }) {
  return (
    <div className="card p-6">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between hover:text-indigo-300 transition mb-4"
      >
        <h3 className="text-2xl font-bold">{title}</h3>
        <span className="text-2xl">{open ? "-" : "+"}</span>
      </button>

      {open && <div>{children}</div>}
    </div>
  );
}
