import express from 'express';

const router = express.Router();

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

router.post('/:id', async (req, res) => {
  try {
    const { title, plot } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { message: "Title required" }
      });
    }

    const prompt = `
You are a knowledgeable film critic providing clear, insightful explanations of movies.

Analyze the following movie and provide a structured response:

Movie Title: ${title}
Plot Summary: ${plot}

Provide a JSON response with exactly this structure:
{
  "summary": "A clear, concise explanation of the movie's story and main plot points (2-3 sentences)",
  "themes": ["theme1", "theme2", "theme3"],
  "whyWorthIt": "Why this movie is worth watching - what makes it special or impactful (2-3 sentences)"
}

Guidelines:
- Keep the summary factual and spoiler-free
- Themes should be meaningful concepts, not generic (e.g., "redemption through sacrifice" not "good vs evil")
- WhyWorthIt should highlight unique aspects, performances, or cultural impact
- Use professional, engaging language without slang or memes
- Ensure themes are diverse and insightful
`;

    const response = await fetch(
      `${GEMINI_URL}?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed;

    try {
      // Clean the response text
      const cleanedText = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", text);

      // Fallback structure
      parsed = {
        summary: "Unable to generate summary at this time.",
        themes: ["Analysis unavailable"],
        whyWorthIt: "Please try again later."
      };
    }

    // Validate the structure
    if (!parsed.summary || !Array.isArray(parsed.themes) || !parsed.whyWorthIt) {
      parsed = {
        summary: parsed.summary || "Summary not available.",
        themes: Array.isArray(parsed.themes) ? parsed.themes : ["Themes not available"],
        whyWorthIt: parsed.whyWorthIt || "Recommendation not available."
      };
    }

    res.json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({
      success: false,
      error: { message: "AI failed" }
    });
  }
});

export default router;