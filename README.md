# CurioCue 🎬

A modern, smart, and funny discovery platform for movies, series, anime, books, and documentaries.

## Overview

CurioCue is your personal guide to what to watch, read, or discover next. Instead of boring search engines, it feels like a friend explaining things in a fun, relatable way with a touch of Hinglish humor.

**Key Features:**
- 🔍 Search by title, genre, mood, or topic
- 😂 Funny Hinglish-style summaries
- 🚫 Spoiler-safe with optional ending explanations
- 📚 Explanations of tricky words, references, and themes
- ⚖️ Legal, free, and official viewing/reading options only
- ❤️ Save and share your picks
- 💫 Smart recommendations based on your taste

## Tech Stack

### Frontend
- React 18
- Vite (blazing fast build)
- Tailwind CSS (modern styling)
- React Router (navigation)
- Axios (HTTP client)

### Backend
- Node.js
- Express.js
- Sample data with API structure ready for real integrations (TMDB, OMDB, Google Books)

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`

**Optional:** Add API keys to `.env`:
- TMDB: https://www.themoviedb.org/settings/api
- OMDB: http://www.omdbapi.com/apikey.aspx
- Google Books: https://console.cloud.google.com/

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

**That's it!** Open http://localhost:5173 in your browser.

## Project Structure

```
CurioCue/
├── backend/
│   ├── middleware/           # Express middleware
│   ├── routes/              # API endpoints
│   │   ├── search.js        # GET /api/search
│   │   ├── title.js         # GET /api/title/:id
│   │   ├── explain.js       # GET /api/explain/:id
│   │   ├── availability.js  # GET /api/availability/:id
│   │   └── recommendations.js
│   ├── utils/               # Helper functions
│   │   ├── apiClient.js     # External API integration
│   │   └── sampleData.js    # Sample titles & data
│   ├── server.js            # Main server file
│   ├── .env.example         # Environment template
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── TitleCard.jsx
│   │   │   ├── AvailabilityCard.jsx
│   │   │   ├── ExplainSection.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── SearchResults.jsx
│   │   │   ├── TitleDetails.jsx
│   │   │   └── SavedList.jsx
│   │   ├── utils/          # Helper utilities
│   │   │   ├── api.js      # API client
│   │   │   ├── storage.js  # LocalStorage utilities
│   │   │   └── shareUtils.js
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## API Endpoints

### Search
```bash
GET /api/search?q=inception&type=movie&genre=action
GET /api/search/suggestions
```

### Title Details
```bash
GET /api/title/:id
GET /api/title/:id/similar
```

### Explanations
```bash
GET /api/explain/:id
POST /api/explain/word { word, context }
```

### Availability (Where to Watch/Read)
```bash
GET /api/availability/:id?region=US
```

### Recommendations
```bash
GET /api/recommendations?type=movie&limit=10
POST /api/recommendations/based-on-history { titleIds }
```

## Features Deep Dive

### 🎯 Search & Discovery
- Search across movies, series, anime, books, and documentaries
- Filter by genre, mood, or content type
- Mood-based filters: "Weekend Watch", "Short Binge", "Emotional", etc.
- Trending and recommended sections

### 📱 Smart Details Page
- Full title information (director, cast, year, duration, etc.)
- Funny Hinglish-style summary
- Spoiler-light plot description
- Rating and reviews

### 🧠 Deep Explanations
- **Themes**: Core themes and deeper meaning
- **Tricky Words**: Expandable explanations of complex references
- **Ending Explanation**: Optional, clearly marked SPOILER section
- **Why Worth Your Time**: Quick reasons to watch/read

### 📺 Legal Viewing/Reading Options
- Shows where to legally watch/read for free
- Free with ads options
- Subscription services
- Buy/rent options
- Legal sources only, no piracy recommendations

### ❤️ Personal Features
- Save titles to your personal list
- View your watch/read history
- Share picks via Twitter, WhatsApp, or native share
- Recommendations based on your saved titles

### 🎨 Modern UI/UX
- Dark theme optimized for eye comfort
- Smooth animations and transitions
- Card-based responsive layout
- Mobile-first design
- Fast and snappy interactions

## Development Guide

### Adding a New Title

Edit `backend/utils/sampleData.js` and add to `sampleTitles` array:

```javascript
{
  id: 'unique_id',
  type: 'movie', // 'series', 'anime', 'book', 'documentary'
  title: 'Title Name',
  year: 2024,
  rating: 8.5,
  image: 'image_url',
  summary: 'Hinglish summary...',
  plot: 'Full plot...',
  themes: ['theme1', 'theme2'],
  genre: ['Action', 'Thriller'],
  trickyWords: [
    { word: 'Term', explanation: 'Explanation...' }
  ],
  ending: 'Ending explanation...',
  recommendations: ['SimilarTitle1', 'SimilarTitle2'],
  availability: [
    { platform: 'Netflix', type: 'subscription', url: '#' }
  ],
  // Add type-specific fields as needed
}
```

### Integrating Real APIs

1. **TMDB** (Movies & TV):
   - Update `backend/utils/apiClient.js`
   - Get API key from https://www.themoviedb.org/settings/api
   - Set in `.env`

2. **Google Books API**:
   - Already partially integrated
   - Requires API key setup

3. **OMDB** (Additional movie data):
   - Get key from http://www.omdbapi.com/apikey.aspx
   - Already integrated in `apiClient.js`

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to hosting
```

## Deployment

### Backend
- Deploy to Heroku, Vercel, Railway, or any Node.js hosting
- Set environment variables
- Run `npm install && npm start`

### Frontend
- Build: `npm run build`
- Deploy `dist/` folder to Vercel, Netlify, GitHub Pages, or any static hosting
- Update `VITE_API_URL` if backend is on different domain

## Configuration

### Environment Variables

**Backend (.env)**
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
TMDB_API_KEY=your_key_here
OMDB_API_KEY=your_key_here
GOOGLE_BOOKS_API_KEY=your_key_here
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill the process or use different port
PORT=5001 npm run dev
```

### Frontend can't connect to backend
- Make sure backend is running on `http://localhost:5000`
- Check CORS settings in `backend/server.js`
- Verify proxy in `frontend/vite.config.js`

### API keys not working
- Double-check API key in `.env`
- Verify you're using the correct API (TMDB, OMDB, etc.)
- Check if free tier limits are exceeded

## Contributing

Feel free to fork and improve! Some ideas:
- Add more API integrations (IMDb, AniList, etc.)
- Implement user accounts and syncing
- Add AI-powered recommendations
- Create mobile app with React Native
- Add rating and review system
- Implement watch parties / friend comparisons

## License

MIT - Feel free to use this for personal and commercial projects!

## Support

Stuck? Check:
1. Backend README: `backend/README.md`
2. Frontend README: `frontend/README.md`
3. See error messages in console for specific guidance

---

Made with ❤️ for curious minds. Discover what to watch, read, and explore next!
