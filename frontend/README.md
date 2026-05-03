# CurioCue Frontend

React + Vite + Tailwind CSS frontend for the CurioCue discovery platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Features

### Pages
- **Home**: Hero section, content type filters, trending titles
- **Search**: Advanced search with filters by genre, type, and mood
- **Home**: Hero section, search bar with suggestions, trending titles.
- **Search**: Advanced search with filters by genre and type.
- **Title Details**: Full information, themes, ending explanations, availability
- **Saved List**: Your personal collection of titles

### Components
- **Header**: Navigation and search bar
- **TitleCard**: Reusable title display with save/share
- **LoadingSpinner**: Beautiful loading state
- **LoadingSpinner**: Beautiful loading state (inlined in pages).
- **AvailabilityCard**: Where to legally watch/read
- **ExplainSection**: Themes, tricky words, ending explanations
- **Footer**: Links and information

### Features
- ✅ Search by title, genre, mood
- ✅ Save titles to local storage
- ✅ Share titles via Twitter, WhatsApp, native share
- ✅ Dark modern UI with Tailwind CSS
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations and transitions
- ✅ Error handling and loading states

## Project Structure

```
src/
├── components/        # Reusable components
├── pages/            # Page components
├── utils/            # Helper functions
│   ├── api.js        # API client
│   ├── storage.js    # Local storage utilities
│   └── shareUtils.js # Social sharing utilities
├── App.jsx           # Main app component
├── main.jsx          # React DOM entry
└── index.css         # Global styles
```

## Configuration

- **Vite**: Fast build tool and dev server
- **Tailwind**: Utility-first CSS framework with custom theme
- **React Router**: Client-side navigation
- **Axios**: HTTP client for API calls

## API Integration

Frontend communicates with backend at `http://localhost:5000/api`:
- `/api/search` - Search titles
- `/api/title/:id` - Get title details
- `/api/explain/:id` - Get explanations
- `/api/availability/:id` - Get legal watching options
- `/api/recommendations` - Get recommendations

## Development

- Hot module replacement (HMR) for instant updates
- Proxy to backend for seamless API calls
- Production build with optimizations

## Notes

- All data persisted locally using browser's localStorage
- No authentication required
- Fully functional with sample data
