import express from "express";

const router = express.Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const GENRE_MAP = {
  action: 28,
  comedy: 35,
  drama: 18,
  fantasy: 14,
  horror: 27,
  thriller: 53,
  animation: 16,
  documentary: 99,
};

const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value = "") => normalizeText(value).split(" ").filter(Boolean);
const BOOK_NOISE_TERMS = [
  "summary",
  "study",
  "guide",
  "sparknotes",
  "analysis",
  "workbook",
  "companion",
  "teacher",
  "student",
  "digest",
  "review",
  "notes",
];

const damerauLevenshtein = (left = "", right = "") => {
  const a = String(left);
  const b = String(right);
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );

      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
      }
    }
  }

  return matrix[a.length][b.length];
};

const isFuzzyTokenMatch = (queryToken, candidateToken) => {
  if (!queryToken || !candidateToken) return false;
  if (candidateToken.includes(queryToken) || queryToken.includes(candidateToken)) return true;
  if (queryToken.length < 4 || candidateToken.length < 4) return false;

  return damerauLevenshtein(queryToken, candidateToken) <= 2;
};

const countTokenMatches = (queryTokens, candidateTokens = []) =>
  queryTokens.filter((queryToken) =>
    candidateTokens.some((candidateToken) => isFuzzyTokenMatch(queryToken, candidateToken))
  ).length;

const isLikelyBookNoise = (info = {}) => {
  const titleText = normalizeText(`${info.title || ""} ${info.subtitle || ""}`);
  return BOOK_NOISE_TERMS.some((term) => titleText.includes(term));
};

const toHttpsImage = (url) =>
  url ? url.replace(/^http:\/\//i, "https://") : null;

const enhanceBookImage = (url) =>
  toHttpsImage(url)?.replace("zoom=1", "zoom=2") || null;

const normalizeTmdbItem = (item, requestedType) => {
  const isTV = item.media_type === "tv";
  const year = (item.release_date || item.first_air_date || "").split("-")[0] || null;
  const isAnime = requestedType === "anime" || isAnimeEntry(item);
  const type = isAnime ? "anime" : isTV ? "series" : "movie";
  const typeLabel = isAnime ? "Anime" : type === "series" ? "Series" : "Movie";

  return {
    id: item.id,
    type,
    typeLabel,
    title: item.title || item.name || "Unknown Title",
    year,
    rating: typeof item.vote_average === "number" ? item.vote_average : null,
    image: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null,
    summary: item.overview || "",
    genre: Array.isArray(item.genre_ids) ? item.genre_ids : [],
  };
};

const normalizeBookItem = (volume, score = 0) => ({
  id: `book-${volume.id}`,
  sourceId: volume.id,
  type: "book",
  typeLabel: "Book",
  title: volume.volumeInfo?.title || "Unknown Title",
  year: volume.volumeInfo?.publishedDate?.split("-")[0] || null,
  publishedDate: volume.volumeInfo?.publishedDate || null,
  rating: typeof volume.volumeInfo?.averageRating === "number"
    ? volume.volumeInfo.averageRating
    : null,
  image: enhanceBookImage(
    volume.volumeInfo?.imageLinks?.extraLarge ||
      volume.volumeInfo?.imageLinks?.large ||
      volume.volumeInfo?.imageLinks?.medium ||
      volume.volumeInfo?.imageLinks?.thumbnail ||
      volume.volumeInfo?.imageLinks?.smallThumbnail
  ),
  imageLinks: volume.volumeInfo?.imageLinks || {},
  authors: Array.isArray(volume.volumeInfo?.authors) ? volume.volumeInfo.authors : [],
  industryIdentifiers: Array.isArray(volume.volumeInfo?.industryIdentifiers)
    ? volume.volumeInfo.industryIdentifiers
    : [],
  summary: volume.volumeInfo?.description || "",
  pageCount: volume.volumeInfo?.pageCount || null,
  publisher: volume.volumeInfo?.publisher || null,
  genre: Array.isArray(volume.volumeInfo?.categories) ? volume.volumeInfo.categories : [],
  score,
});

const matchesGenre = (genreFilter, genreIds, categories) => {
  if (!genreFilter) return true;

  const normalized = genreFilter.toLowerCase();
  const genreId = GENRE_MAP[normalized];

  if (genreId && Array.isArray(genreIds) && genreIds.includes(genreId)) {
    return true;
  }

  if (Array.isArray(categories)) {
    return categories.some((category) => category.toLowerCase().includes(normalized));
  }

  return false;
};

const isAnimeEntry = (item) => {
  if (item.media_type !== "tv") return false;

  const genres = Array.isArray(item.genre_ids) ? item.genre_ids : [];
  return (
    item.origin_country?.includes("JP") ||
    genres.includes(GENRE_MAP.animation) ||
    item.name?.toLowerCase().includes("anime")
  );
};

const scoreBookMatch = (volume, query) => {
  const info = volume.volumeInfo || {};
  const normalizedQuery = normalizeText(query);
  const queryTokens = tokenize(query);
  const title = normalizeText(info.title || "");
  const subtitle = normalizeText(info.subtitle || "");
  const titleTokens = tokenize(`${info.title || ""} ${info.subtitle || ""}`);
  const authors = Array.isArray(info.authors) ? info.authors.map(normalizeText) : [];
  const authorTokens = authors.flatMap((author) => tokenize(author));
  const categories = Array.isArray(info.categories) ? info.categories.map(normalizeText) : [];
  const categoryTokens = categories.flatMap((category) => tokenize(category));

  if (!title) return -1;

  let score = 0;

  if (title === normalizedQuery || `${title} ${subtitle}`.trim() === normalizedQuery) {
    score += 140;
  } else if (title.startsWith(normalizedQuery)) {
    score += 100;
  } else if (title.includes(normalizedQuery)) {
    score += 75;
  } else if (normalizedQuery.includes(title) && title.length > 4) {
    score += 45;
  }

  const titleHits = countTokenMatches(queryTokens, titleTokens);
  const authorHits = countTokenMatches(queryTokens, authorTokens);
  const categoryHits = countTokenMatches(queryTokens, categoryTokens);

  score += titleHits * 16;
  score += authorHits * 8;
  score += categoryHits * 4;

  if (queryTokens.length > 0 && titleHits >= Math.max(1, queryTokens.length - 1)) {
    score += 20;
  }

  if (titleHits >= 2 && authorHits > 0) {
    score += 18;
  }

  if (isLikelyBookNoise(info)) {
    score -= 45;
  }

  if (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail) {
    score += 10;
  }

  if (typeof info.averageRating === "number") {
    score += Math.min(info.averageRating * 2, 10);
  }

  if (typeof info.ratingsCount === "number" && info.ratingsCount > 0) {
    score += Math.min(Math.log10(info.ratingsCount + 1) * 5, 10);
  }

  if (info.description) {
    score += 4;
  }

  return score;
};

const curateBookResults = (items, query, requestedType, requestedGenre) => {
  const curated = items
    .map((item) => {
      const score = scoreBookMatch(item, query);
      return { item, score };
    })
    .filter(({ item, score }) => {
      const categories = Array.isArray(item.volumeInfo?.categories) ? item.volumeInfo.categories : [];
      const title = normalizeText(item.volumeInfo?.title || "");
      const normalizedQuery = normalizeText(query);
      const titleTokens = tokenize(`${item.volumeInfo?.title || ""} ${item.volumeInfo?.subtitle || ""}`);
      const authorTokens = Array.isArray(item.volumeInfo?.authors)
        ? item.volumeInfo.authors.flatMap((author) => tokenize(author))
        : [];
      const queryTokens = tokenize(query);
      const titleHits = countTokenMatches(queryTokens, titleTokens);
      const authorHits = countTokenMatches(queryTokens, authorTokens);
      const hasNoiseTitle = isLikelyBookNoise(item.volumeInfo || {});
      const strongTitleMatch =
        title === normalizedQuery ||
        title.startsWith(normalizedQuery) ||
        title.includes(normalizedQuery) ||
        titleHits >= Math.max(1, queryTokens.length - 1) ||
        (titleHits >= 1 && authorHits >= 1);
      const threshold = requestedType === "book" ? 32 : 44;

      return (
        score >= threshold &&
        strongTitleMatch &&
        !hasNoiseTitle &&
        matchesGenre(requestedGenre, [], categories)
      );
    })
    .sort((a, b) => b.score - a.score);

  return curated.slice(0, 1).map(({ item, score }) => normalizeBookItem(item, score));
};

const fetchGoogleBooksQuery = async (query, page = 1, maxResults = 6) => {
  const startIndex = Math.max(0, Number(page) - 1) * 10;
  const params = new URLSearchParams({
    q: query,
    printType: "books",
    orderBy: "relevance",
    maxResults: String(maxResults),
    startIndex: String(startIndex),
  });

  if (process.env.GOOGLE_BOOKS_API_KEY) {
    params.set("key", process.env.GOOGLE_BOOKS_API_KEY);
  }

  const response = await fetch(`${GOOGLE_BOOKS_BASE}/volumes?${params.toString()}`);
  const data = await response.json();

  return {
    items: Array.isArray(data.items) ? data.items : [],
    total: data.totalItems || 0,
    hasMore: data.totalItems > startIndex + Number(params.get("maxResults")),
  };
};

const fetchGoogleBooks = async (query, page = 1, requestedType) => {
  const maxResults = requestedType === "book" ? 8 : 5;
  const [titleFocused, broad] = await Promise.all([
    fetchGoogleBooksQuery(`intitle:${query}`, page, maxResults),
    fetchGoogleBooksQuery(query, page, maxResults),
  ]);

  const dedupedItems = [];
  const seenIds = new Set();

  for (const item of [...titleFocused.items, ...broad.items]) {
    if (!item?.id || seenIds.has(item.id)) continue;
    seenIds.add(item.id);
    dedupedItems.push(item);
  }

  return {
    items: dedupedItems,
    total: Math.max(titleFocused.total, broad.total),
    hasMore: titleFocused.hasMore || broad.hasMore,
  };
};

const fetchTmdbMulti = async (query, page = 1) => {
  const response = await fetch(
    `${TMDB_BASE}/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  const data = await response.json();

  return {
    items: Array.isArray(data.results) ? data.results : [],
    page: data.page || 1,
    total: data.total_results || 0,
    totalPages: data.total_pages || 1,
    hasMore: data.page < data.total_pages,
  };
};

router.get("/", async (req, res) => {
  try {
    const { q, page = 1, type, genre } = req.query;

    if (!q || !q.trim()) {
      return res.json({
        success: true,
        data: { results: [], pagination: {} },
      });
    }

    const requestedType = type?.toLowerCase();
    const requestedGenre = genre?.toLowerCase();
    const shouldFetchTmdb = requestedType !== "book";
    const shouldFetchBooks = !requestedType || requestedType === "book";

    const [tmdbData, googleBooksData] = await Promise.all([
      shouldFetchTmdb ? fetchTmdbMulti(q.trim(), page) : Promise.resolve(null),
      shouldFetchBooks ? fetchGoogleBooks(q.trim(), page, requestedType) : Promise.resolve(null),
    ]);

    let tmdbItems = Array.isArray(tmdbData?.items)
      ? tmdbData.items.filter((item) => item.media_type === "movie" || item.media_type === "tv")
      : [];

    if (requestedType === "movie") {
      tmdbItems = tmdbItems.filter((item) => item.media_type === "movie");
    } else if (requestedType === "series") {
      tmdbItems = tmdbItems.filter((item) => item.media_type === "tv");
    } else if (requestedType === "anime") {
      tmdbItems = tmdbItems.filter(isAnimeEntry);
    } else if (requestedType === "documentary") {
      tmdbItems = tmdbItems.filter(
        (item) => Array.isArray(item.genre_ids) && item.genre_ids.includes(GENRE_MAP.documentary)
      );
    }

    tmdbItems = tmdbItems.filter((item) => matchesGenre(requestedGenre, item.genre_ids, []));

    const movieResults = tmdbItems.map((item) => normalizeTmdbItem(item, requestedType));
    const bookResults = googleBooksData
      ? curateBookResults(googleBooksData.items, q.trim(), requestedType, requestedGenre)
      : [];

    const results = [...movieResults, ...bookResults].slice(0, 20);

    res.json({
      success: true,
      data: {
        results,
        pagination: {
          page: Number(page),
          pageSize: results.length,
          total: requestedType === "book"
            ? bookResults.length
            : movieResults.length + bookResults.length,
          hasMore: Boolean(tmdbData?.hasMore || googleBooksData?.hasMore),
        },
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Search failed" },
    });
  }
});

router.get("/suggestions", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] },
      });
    }

    const response = await fetch(
      `${TMDB_BASE}/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q.trim())}&page=1`
    );
    const data = await response.json();

    const suggestions = Array.isArray(data.results)
      ? data.results
          .filter((item) => item.media_type === "movie" || item.media_type === "tv")
          .slice(0, 7)
          .map((item) => ({
            id: item.id,
            type: item.media_type === "tv" ? "series" : "movie",
            title: item.title || item.name || "Unknown Title",
            year: (item.release_date || item.first_air_date)?.split("-")[0] || null,
            image: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : null,
          }))
      : [];

    res.json({
      success: true,
      data: { suggestions },
    });
  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(500).json({
      success: false,
      error: { message: "Failed to fetch suggestions" },
    });
  }
});

export default router;
