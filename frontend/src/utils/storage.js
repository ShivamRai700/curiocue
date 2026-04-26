// Local storage utilities

const STORAGE_KEYS = {
  SAVED_TITLES: 'curiocue_saved',
  HISTORY: 'curiocue_history',
  PREFERENCES: 'curiocue_preferences',
};

export const saveTitleToList = (title) => {
  const saved = getSavedTitles();
  const exists = saved.some(t => t.id === title.id);

  if (!exists) {
    saved.push({
      ...title,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.SAVED_TITLES, JSON.stringify(saved));
  }

  return !exists;
};

export const removeTitleFromList = (titleId) => {
  const saved = getSavedTitles().filter(t => t.id !== titleId);
  localStorage.setItem(STORAGE_KEYS.SAVED_TITLES, JSON.stringify(saved));
};

export const getSavedTitles = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SAVED_TITLES);
  return data ? JSON.parse(data) : [];
};

export const isTitleSaved = (titleId) => {
  return getSavedTitles().some(t => t.id === titleId);
};

export const addToHistory = (title) => {
  const history = getHistory();
  const filtered = history.filter(t => t.id !== title.id);
  filtered.unshift({
    ...title,
    viewedAt: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered.slice(0, 50)));
};

export const getHistory = () => {
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
};

export const setPreference = (key, value) => {
  const prefs = getPreferences();
  prefs[key] = value;
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
};

export const getPreference = (key, defaultValue) => {
  const prefs = getPreferences();
  return prefs[key] || defaultValue;
};

export const getPreferences = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
  return data ? JSON.parse(data) : {};
};
