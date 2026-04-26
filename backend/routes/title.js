import express from 'express';

const router = express.Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// 🔥 GET TITLE DETAILS
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const url = `${TMDB_BASE}/movie/${id}?api_key=${process.env.TMDB_API_KEY}`;

    const response = await fetch(url);
    const movie = await response.json();

    if (!movie || movie.status_code) {
      return res.status(404).json({
        success: false,
        error: { message: "Title not found" }
      });
    }

    res.json({
      success: true,
      data: {
        id: movie.id,
        title: movie.title,
        year: movie.release_date?.split("-")[0],
        rating: movie.vote_average,
        image: movie.poster_path
          ? IMAGE_BASE + movie.poster_path
          : null,
        summary: movie.overview,
        genres: movie.genres?.map(g => g.name)
      }
    });

  } catch (error) {
    console.error("Title error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch title" }
    });
  }
});

// 🔥 SIMILAR MOVIES
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;

    const url = `${TMDB_BASE}/movie/${id}/similar?api_key=${process.env.TMDB_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      image: movie.poster_path
        ? IMAGE_BASE + movie.poster_path
        : null
    }));

    res.json({ success: true, data: results });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch similar titles" }
    });
  }
});

export default router;