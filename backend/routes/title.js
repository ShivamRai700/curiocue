import express from 'express';

const router = express.Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const formatTitleResponse = (item, type) => ({
  id: item.id,
  type,
  title: item.title || item.name || 'Unknown Title',
  year: (item.release_date || item.first_air_date)?.split('-')[0] || null,
  rating: item.vote_average,
  image: item.poster_path ? IMAGE_BASE + item.poster_path : null,
  summary: item.overview || '',
  genre: item.genres?.map((g) => g.name) || []
});

const fetchTmdbJson = async (url) => {
  const response = await fetch(url);
  return response.json();
};

// 🔥 GET TITLE DETAILS
router.get('/:type/:id', async (req, res) => {
  try {
    const { id, type } = req.params;
    const requestedType = type === 'series' ? 'series' : 'movie';
    const endpoint = requestedType === 'series' ? 'tv' : 'movie';

    const url = `${TMDB_BASE}/${endpoint}/${id}?api_key=${process.env.TMDB_API_KEY}`;
    const item = await fetchTmdbJson(url);

    if (!item || item.status_code) {
      return res.status(404).json({
        success: false,
        error: { message: 'Title not found' }
      });
    }

    res.json({
      success: true,
      data: formatTitleResponse(item, requestedType)
    });

  } catch (error) {
    console.error("Title error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch title" }
    });
  }
});

// 🔥 LEGACY TITLE DETAILS FALLBACK
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const requestedType = req.query.type === 'series' ? 'series' : 'movie';
    const endpoint = requestedType === 'series' ? 'tv' : 'movie';

    let item = await fetchTmdbJson(`${TMDB_BASE}/${endpoint}/${id}?api_key=${process.env.TMDB_API_KEY}`);
    let type = requestedType;

    if (!item || item.status_code) {
      const fallbackEndpoint = requestedType === 'series' ? 'movie' : 'tv';
      item = await fetchTmdbJson(`${TMDB_BASE}/${fallbackEndpoint}/${id}?api_key=${process.env.TMDB_API_KEY}`);
      type = requestedType === 'series' ? 'movie' : 'series';
    }

    if (!item || item.status_code) {
      return res.status(404).json({
        success: false,
        error: { message: 'Title not found' }
      });
    }

    res.json({
      success: true,
      data: formatTitleResponse(item, type)
    });
  } catch (error) {
    console.error("Legacy title error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch legacy title" }
    });
  }
});

// 🔥 SIMILAR MOVIES / SERIES
router.get('/:type/:id/similar', async (req, res) => {
  try {
    const { id, type } = req.params;
    const requestedType = type === 'series' ? 'series' : 'movie';
    const endpoint = requestedType === 'series' ? 'tv' : 'movie';

    let data = await fetchTmdbJson(`${TMDB_BASE}/${endpoint}/${id}/similar?api_key=${process.env.TMDB_API_KEY}`);

    if (!data || data.status_code) {
      const fallbackEndpoint = requestedType === 'series' ? 'movie' : 'tv';
      data = await fetchTmdbJson(`${TMDB_BASE}/${fallbackEndpoint}/${id}/similar?api_key=${process.env.TMDB_API_KEY}`);
    }

    const results = Array.isArray(data.results)
      ? data.results.map((item) => ({
          id: item.id,
          title: item.title || item.name || 'Unknown Title',
          image: item.poster_path ? IMAGE_BASE + item.poster_path : null
        }))
      : [];

    res.json({ success: true, data: results });

  } catch (error) {
    console.error("Similar titles error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch similar titles" }
    });
  }
});

export default router;