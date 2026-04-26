# CurioCue Backend

Node.js + Express API for the CurioCue discovery platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Add your API keys:
- TMDB: https://www.themoviedb.org/settings/api
- OMDB: http://www.omdbapi.com/apikey.aspx
- Google Books: https://console.cloud.google.com/

## Running

Development with auto-reload:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Search
- `GET /api/search?q=query&type=movie` - Search for titles
- `GET /api/search/suggestions` - Get filter options

### Titles
- `GET /api/title/:id` - Get title details
- `GET /api/title/:id/similar` - Get similar titles

### Explanations
- `GET /api/explain/:id` - Get themes, ending, tricky words
- `POST /api/explain/word` - Explain specific words

### Availability
- `GET /api/availability/:id` - Get legal free/paid options

### Recommendations
- `GET /api/recommendations` - Get recommendations
- `POST /api/recommendations/based-on-history` - Personalized recommendations

## Environment Variables

See `.env.example` for all available options.

## Project Structure

```
backend/
├── middleware/      # Express middleware
├── routes/         # API route handlers
├── utils/          # Helper functions
├── server.js       # Main server file
├── .env.example    # Environment template
└── package.json    # Dependencies
```

## Notes

- Uses public APIs with sample data fallback
- Rate limited to prevent abuse
- CORS enabled for frontend communication
- Error handling for all routes
