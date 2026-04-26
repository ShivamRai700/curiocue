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
You explain movies in a FUN, RELATABLE, slightly Hinglish way.

Make it:
- Short (3-5 bullet points)
- Funny but insightful
- No boring academic tone
- Gen Z relatable

Movie: ${title}
Plot: ${plot}

Output ONLY JSON:

{
  "themes": [
    "point 1",
    "point 2",
    "point 3"
  ]
}
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
      parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      return res.json({
        success: true,
        data: {
          themes: [text] // fallback
        }
      });
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