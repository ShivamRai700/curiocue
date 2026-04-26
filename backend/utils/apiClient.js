import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const OMDB_BASE = 'http://www.omdbapi.com';
const GOOGLE_BOOKS_BASE = 'https://www.googleapis.com/books/v1';

export const searchTMDB = async (query, type = 'multi') => {
  try {
    const response = await axios.get(`${TMDB_BASE}/search/${type}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
        page: 1
      }
    });
    return response.data.results || [];
  } catch (error) {
    console.error('TMDB search error:', error.message);
    return [];
  }
};

export const getTitleDetails = async (id, type = 'movie') => {
  try {
    const response = await axios.get(`${TMDB_BASE}/${type}/${id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        append_to_response: 'credits,recommendations,external_ids'
      }
    });
    return response.data;
  } catch (error) {
    console.error('TMDB details error:', error.message);
    return null;
  }
};

export const getBookDetails = async (query) => {
  try {
    const response = await axios.get(`${GOOGLE_BOOKS_BASE}/volumes`, {
      params: {
        q: query,
        key: process.env.GOOGLE_BOOKS_API_KEY,
        maxResults: 10
      }
    });
    return response.data.items || [];
  } catch (error) {
    console.error('Google Books error:', error.message);
    return [];
  }
};

export const searchOMDB = async (title) => {
  try {
    const response = await axios.get(OMDB_BASE, {
      params: {
        apikey: process.env.OMDB_API_KEY,
        s: title,
        type: 'series'
      }
    });
    return response.data.Search || [];
  } catch (error) {
    console.error('OMDB search error:', error.message);
    return [];
  }
};
