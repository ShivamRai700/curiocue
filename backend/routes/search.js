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

// 🔧 KEEP THIS (for filters)
router.get('/suggestions', (req, res) => {
    res.json({
        success: true,
        data: {
            genres: [], // optional for now
            moods: [],  // optional
            types: ['movie', 'series', 'anime', 'book', 'documentary']
        }
    });
});

export default router;