import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ||'/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Search
export const searchTitles = (query, type, genre, mood, page) => {
  return apiClient.get('/search', {
    params: { q: query, type, genre, mood, page }
  });
};

export const getSearchSuggestions = (query) => {
  return apiClient.get('/search/suggestions', {
    params: { q: query }
  });
};

// Title Details
export const getTitleDetails = (type, id) => {
  return apiClient.get(`/title/${type}/${id}`);
};

export const getSimilarTitles = (type, id) => {
  return apiClient.get(`/title/${type}/${id}/similar`);
};

// Explanations
export const getExplanations = (id) => {
  return apiClient.get(`/explain/${id}`);
};

export const explainWord = (word, context) => {
  return apiClient.post('/explain/word', { word, context });
};

// Availability
export const getAvailability = (id, region) => {
  return apiClient.get(`/availability/${id}`, { params: { region } });
};

// Recommendations
export const getRecommendations = (type, mood, limit) => {
  return apiClient.get('/recommendations', {
    params: { type, mood, limit }
  });
};

export const getRecommendationsByHistory = (titleIds) => {
  return apiClient.post('/recommendations/based-on-history', { titleIds });
};

// AI Explanation
export const getAIExplanation = (title, plot, id) => {
  return apiClient.post(`/explain/${id}`, {
    title,
    plot
  });
};

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data?.error?.message || 'Something went wrong';
  }
  if (error.request) {
    return 'No response from server. Is the backend running?';
  }
  return error.message || 'An error occurred';
};