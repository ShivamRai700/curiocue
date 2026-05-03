import express from "express";

const router = express.Router();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const BOOK_SCREEN_LANGUAGE_REGEX =
  /\b(film|movie|cinematic|screen|watch|watching|viewing|episode|director|performance|scene|adaptation|show)\b/i;

const buildPrompt = ({
  contentType = "movie",
  title,
  plot,
  authors = [],
  categories = [],
  publishedDate,
  purpose,
}) => {
  if (contentType === "book") {
    if (purpose === "introduction") {
      return `
You are writing a compact introduction for a book page.

Book Title: ${title}
Authors: ${Array.isArray(authors) && authors.length > 0 ? authors.join(", ") : "Unknown"}
Published Date: ${publishedDate || "Unknown"}
Categories: ${Array.isArray(categories) && categories.length > 0 ? categories.join(", ") : "Unknown"}
Description: ${plot || "Not available"}

Provide a JSON response with exactly this structure:
{
  "summary": "A polished 3-4 sentence introduction to the book itself",
  "themes": ["theme1", "theme2", "theme3"],
  "whyWorthIt": "A short note on why the book matters or why it is worth reading",
  "readingStyle": "A short description of the reading experience"
}

Rules:
- Write only about the book, never a film, movie, screen adaptation, or show
- If the description is missing, rely on literary knowledge of the book title and author when possible
- Keep the summary compact, confident, and reader-friendly
- Do not use phrases like "the film follows" or "this adaptation"
- Return valid JSON only
`;
    }

    return `
You are a thoughtful literary guide who explains books clearly and accessibly.

Analyze the following book and provide a structured response:

Book Title: ${title}
Authors: ${Array.isArray(authors) && authors.length > 0 ? authors.join(", ") : "Unknown"}
Published Date: ${publishedDate || "Unknown"}
Categories: ${Array.isArray(categories) && categories.length > 0 ? categories.join(", ") : "Unknown"}
Description: ${plot || "Not available"}

Provide a JSON response with exactly this structure:
{
  "summary": "A clear, spoiler-light explanation of what the book is about in 2-3 sentences",
  "themes": ["theme1", "theme2", "theme3"],
  "whyWorthIt": "Why the book is worth reading in 2-3 sentences",
  "readingStyle": "A short description of the writing style, tone, or reading experience"
}

Guidelines:
- Keep the summary human and easy to understand
- Focus themes on meaningful ideas, not generic labels
- Explain why the book is rewarding for the right reader
- ReadingStyle should describe tone, pacing, complexity, or voice
- Do not describe the book as a film, movie, adaptation, show, or anything meant to be watched
- Return valid JSON only
`;
  }

  return `
You are a knowledgeable film critic providing clear, insightful explanations of movies and shows.

Analyze the following title and provide a structured response:

Title: ${title}
Plot Summary: ${plot || "Not available"}

Provide a JSON response with exactly this structure:
{
  "summary": "A clear, concise explanation of the story and main plot points in 2-3 sentences",
  "themes": ["theme1", "theme2", "theme3"],
  "whyWorthIt": "Why this title is worth watching in 2-3 sentences"
}

Guidelines:
- Keep the summary factual and spoiler-light
- Themes should be specific and meaningful
- WhyWorthIt should highlight unique strengths or impact
- Return valid JSON only
`;
};

const buildFallback = (contentType, parsed = {}) => {
  if (contentType === "book") {
    return {
      summary: parsed.summary || "Unable to generate a book summary right now.",
      themes: Array.isArray(parsed.themes) && parsed.themes.length > 0
        ? parsed.themes
        : ["Themes unavailable"],
      whyWorthIt:
        parsed.whyWorthIt || "Please try again later for a better reading guide.",
      readingStyle: parsed.readingStyle || "Reading style unavailable.",
    };
  }

  return {
    summary: parsed.summary || "Unable to generate summary at this time.",
    themes: Array.isArray(parsed.themes) && parsed.themes.length > 0
      ? parsed.themes
      : ["Analysis unavailable"],
    whyWorthIt: parsed.whyWorthIt || "Please try again later.",
  };
};

const buildBookSafeFallback = ({ title, authors, categories, publishedDate }) => {
  const authorLine = Array.isArray(authors) && authors.length > 0 ? authors.join(", ") : "the author";
  const categoryLine = Array.isArray(categories) && categories.length > 0
    ? categories.slice(0, 2).join(" and ")
    : "literature";
  const publishedLine = publishedDate ? ` first published in ${publishedDate}` : "";

  return {
    summary: `${title} is a book by ${authorLine}${publishedLine}. It is best approached as a ${categoryLine} work with enduring literary interest.`,
    themes: Array.isArray(categories) && categories.length > 0 ? categories.slice(0, 3) : ["Literature", "Character", "Society"],
    whyWorthIt: `It is worth reading for its lasting themes, memorable voice, and the way it continues to resonate with thoughtful readers.`,
    readingStyle: `Expect a reading experience shaped by the author's voice, period, and themes rather than a screen-style presentation.`,
  };
};

const sanitizeBookExplanation = (parsed, metadata) => {
  const safeFallback = buildBookSafeFallback(metadata);
  const summary = parsed.summary || "";
  const whyWorthIt = parsed.whyWorthIt || "";
  const readingStyle = parsed.readingStyle || "";

  return {
    summary: BOOK_SCREEN_LANGUAGE_REGEX.test(summary) ? safeFallback.summary : summary || safeFallback.summary,
    themes: Array.isArray(parsed.themes) && parsed.themes.length > 0 ? parsed.themes : safeFallback.themes,
    whyWorthIt: BOOK_SCREEN_LANGUAGE_REGEX.test(whyWorthIt) ? safeFallback.whyWorthIt : whyWorthIt || safeFallback.whyWorthIt,
    readingStyle: BOOK_SCREEN_LANGUAGE_REGEX.test(readingStyle) ? safeFallback.readingStyle : readingStyle || safeFallback.readingStyle,
  };
};

router.post("/:id", async (req, res) => {
  try {
    const {
      title,
      plot,
      contentType = "movie",
      authors = [],
      categories = [],
      publishedDate,
      purpose,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { message: "Title required" },
      });
    }

    const response = await fetch(`${GEMINI_URL}?key=${process.env.GOOGLE_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: buildPrompt({
                  contentType,
                  title,
                  plot,
                  authors,
                  categories,
                  publishedDate,
                  purpose,
                }),
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed;

    try {
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", text);
      parsed = {};
    }

    const normalizedData = contentType === "book"
      ? sanitizeBookExplanation(parsed, { title, authors, categories, publishedDate })
      : parsed;

    res.json({
      success: true,
      data: buildFallback(contentType, normalizedData),
    });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({
      success: false,
      error: { message: "AI failed" },
    });
  }
});

export default router;
