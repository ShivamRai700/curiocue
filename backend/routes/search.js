import express from 'express';

const router = express.Router();

const TMDB_BASE = 'https://api.themoviedb.org/3';
const GOOGLE_BOOKS_BASE = 'https://www.googleapis.com/books/v1';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const GENRE_MAP = {
  action: 28,
  comedy: 35,
  drama: 18,
  fantasy: 14,
  horror: 27,
  thriller: 53,
  animation: 16,
  documentary: 99
};

const normalizeTmdbItem = (item) => {
  const isTV = item.media_type === 'tv';
  const title = item.title || item.name || 'Unknown Title';
  const year = (item.release_date || item.first_air_date || '').split('-')[0] || null;

  return {
    id: item.id,
    type: isTV ? 'series' : 'movie',
    title,
    year,
    rating: item.vote_average || 0,
    image: item.poster_path ? IMAGE_BASE + item.poster_path : null,
    summary: item.overview || '',
    genre: Array.isArray(item.genre_ids) ? item.genre_ids : []
  };
};

const normalizeBookItem = (volume) => ({
  id: `book-${volume.id}`,
  type: 'book',
  title: volume.volumeInfo.title || 'Unknown title',
  year: volume.volumeInfo.publishedDate?.split('-')[0] || null,
  rating: volume.volumeInfo.averageRating || null,
  image: volume.volumeInfo.imageLinks?.thumbnail
    ? volume.volumeInfo.imageLinks.thumbnail.replace(/^http:\/\//i, 'https://')
    : null,
  summary: volume.volumeInfo.description || '',
  genre: Array.isArray(volume.volumeInfo.categories) ? volume.volumeInfo.categories : []
});

const matchesGenre = (genreFilter, genreIds, categories) => {
  if (!genreFilter) return true;
  const normalized = genreFilter.toLowerCase();
  const genreId = GENRE_MAP[normalized];

  if (genreId && Array.isArray(genreIds) && genreIds.includes(genreId)) {
    return true;
  }

  if (Array.isArray(categories)) {
    return categories.some((category) =>
      category.toLowerCase().includes(normalized)
    );
  }

  return false;
};

const isAnimeEntry = (item) => {
  if (item.media_type !== 'tv') return false;
  const genres = Array.isArray(item.genre_ids) ? item.genre_ids : [];
  return (
    item.origin_country?.includes('JP') ||
    genres.includes(GENRE_MAP.animation) ||
    item.name?.toLowerCase().includes('anime')
  );
};

const fetchGoogleBooks = async (query, page = 1) => {
  const encodedQuery = encodeURIComponent(query);
  const startIndex = Math.max(0, page - 1) * 10;
  const params = new URLSearchParams({
    q: encodedQuery,
    maxResults: '10',
    startIndex: String(startIndex)
  });

  if (process.env.GOOGLE_BOOKS_API_KEY) {
    params.set('key', process.env.GOOGLE_BOOKS_API_KEY);
  }

  const response = await fetch(`${GOOGLE_BOOKS_BASE}/volumes?${params.toString()}`);
  const data = await response.json();

  return {
    items: Array.isArray(data.items) ? data.items : [],
    total: data.totalItems || 0,
    hasMore: data.totalItems > startIndex + 10
  };
};

const fetchTmdbMulti = async (query, page = 1) => {
  const encodedQuery = encodeURIComponent(query);
  const response = await fetch(`${TMDB_BASE}/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodedQuery}&page=${page}`);
  const data = await response.json();

  return {
    items: Array.isArray(data.results) ? data.results : [],
    page: data.page || 1,
    total: data.total_results || 0,
    totalPages: data.total_pages || 1,
    hasMore: data.page < data.total_pages
  };
};

// 🔥 MAIN SEARCH ROUTE
router.get('/', async (req, res) => {
  try {
    const { q, page = 1, type, genre } = req.query;

    if (!q || !q.trim()) {
      return res.json({
        success: true,
        data: { results: [], pagination: {} }
      });
    }

    const requestedType = type?.toLowerCase();
    const requestedGenre = genre?.toLowerCase();

    const tmdbData = await fetchTmdbMulti(q, page);
    let tmdbItems = tmdbData.items.filter((item) => item.media_type === 'movie' || item.media_type === 'tv');

    if (requestedType === 'movie') {
      tmdbItems = tmdbItems.filter((item) => item.media_type === 'movie');
    } else if (requestedType === 'series') {
      tmdbItems = tmdbItems.filter((item) => item.media_type === 'tv');
    } else if (requestedType === 'anime') {
      tmdbItems = tmdbItems.filter(isAnimeEntry);
    } else if (requestedType === 'documentary') {
      tmdbItems = tmdbItems.filter((item) =>
        Array.isArray(item.genre_ids) && item.genre_ids.includes(GENRE_MAP.documentary)
      );
    }

    tmdbItems = tmdbItems.filter((item) =>
      matchesGenre(requestedGenre, item.genre_ids, [])
    );

    const movieResults = tmdbItems.map((item) => normalizeTmdbItem(item));

    const bookResults = requestedType !== 'movie' && requestedType !== 'series' && requestedType !== 'anime'
      ? (await fetchGoogleBooks(q, page)).items
          .map(normalizeBookItem)
          .filter((book) => matchesGenre(requestedGenre, [], book.genre))
      : [];

    const results = [...movieResults, ...bookResults].slice(0, 20);

    res.json({
      success: true,
      data: {
        results,
        pagination: {
          page: Number(page),
          pageSize: results.length,
          total: movieResults.length + bookResults.length,
          hasMore: tmdbData.hasMore || bookResults.length === 10
        }
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Search failed' }
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
    const url = `${TMDB_BASE}/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodedQuery}&page=1`;

    const response = await fetch(url);
    const data = await response.json();

    const suggestions = Array.isArray(data.results)
      ? data.results
          .filter((item) => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 7)
          .map((item) => ({
            id: item.id,
            type: item.media_type === 'tv' ? 'series' : 'movie',
            title: item.title || item.name || 'Unknown Title',
            year: (item.release_date || item.first_air_date)?.split('-')[0] || null,
            image: item.poster_path ? IMAGE_BASE + item.poster_path : null
          }))
      : [];

    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch suggestions' }
    });
  }
});

export default router;
