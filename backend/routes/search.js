import express from 'express';

const router = express.Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// 🔥 MAIN SEARCH ROUTE
router.get('/', async (req, res) => {
    try {
        const { q, page = 1 } = req.query;

        if (!q) {
            return res.json({
                success: true,
                data: { results: [], pagination: {} }
            });
        }

        const encodedQuery = encodeURIComponent(q);

        const url = `${TMDB_BASE}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodedQuery}&page=${page}`;
        console.log("Calling TMDB:", url);

        const response = await fetch(url);
        const data = await response.json();

        const results = data.results.map(movie => ({
            id: movie.id,
            type: "movie",
            title: movie.title,
            year: movie.release_date?.split("-")[0],
            rating: movie.vote_average,
            image: movie.poster_path
                ? IMAGE_BASE + movie.poster_path
                : null,
            summary: movie.overview,
            genre: movie.genre_ids
        }));

        res.json({
            success: true,
            data: {
                results,
                pagination: {
                    page: data.page,
                    pageSize: results.length,
                    total: data.total_results,
                    hasMore: data.page < data.total_pages
                }
            }
        });

    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Search failed" }
        });
    }
});

// 🔧 SEARCH SUGGESTIONS (real-time autocomplete)
router.get('/suggestions', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.json({
                success: true,
                data: { suggestions: [] }
            });
        }

        const encodedQuery = encodeURIComponent(q.trim());

        // Use TMDB multi search for movies, TV shows, etc.
        const url = `${TMDB_BASE}/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodedQuery}&page=1`;
        console.log("Fetching suggestions:", url);

        const response = await fetch(url);
        const data = await response.json();

        // Filter and map to top 5-7 relevant results
        const suggestions = data.results
            .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            .slice(0, 7)
            .map(item => ({
                id: item.id,
                type: item.media_type,
                title: item.media_type === 'movie' ? item.title : item.name,
                year: item.media_type === 'movie'
                    ? (item.release_date?.split("-")[0])
                    : (item.first_air_date?.split("-")[0]),
                image: item.poster_path
                    ? IMAGE_BASE + item.poster_path
                    : null
            }));

        res.json({
            success: true,
            data: { suggestions }
        });

    } catch (error) {
        console.error("Suggestions error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to fetch suggestions" }
        });
    }
});

export default router;