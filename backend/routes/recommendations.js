import express from 'express';

const router = express.Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// 🔥 GET TRENDING / POPULAR
router.get('/', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const url = `${TMDB_BASE}/movie/popular?api_key=${process.env.TMDB_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results
      .slice(0, limit)
      .map(movie => ({
        id: movie.id,
        type: "movie",
        title: movie.title,
        year: movie.release_date?.split("-")[0],
        rating: movie.vote_average,
        image: movie.poster_path
          ? IMAGE_BASE + movie.poster_path
          : null,
        summary: movie.overview
      }));

    res.json({
      success: true,
      data: {
        recommendations: results,
        count: results.length
      }
    });

  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch recommendations' }
    });
  }
});

// 🔥 BASED ON HISTORY (TEMP SIMPLE VERSION)
router.post('/based-on-history', async (req, res) => {
  try {
    const { titleIds = [] } = req.body;

    // For now just return popular again
    const url = `${TMDB_BASE}/movie/popular?api_key=${process.env.TMDB_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    const results = data.results.slice(0, 10).map(movie => ({
      id: movie.id,
      title: movie.title,
      image: movie.poster_path
        ? IMAGE_BASE + movie.poster_path
        : null
    }));

    res.json({
      success: true,
      data: {
        basedOn: titleIds,
        recommendations: results
      }
    });

  } catch (error) {
    console.error('History recommendations error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch recommendations' }
    });
  }
});

export default router;