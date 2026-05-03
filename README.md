# CurioCue 🎬 - Smart Content Discovery Platform

> *A modern, intelligent discovery platform for movies, series, anime, books, and documentaries with AI-powered explanations and personalized recommendations.*

## 🌟 Overview

CurioCue is a full-stack web application that revolutionizes how users discover and understand entertainment content. Instead of bland search results, CurioCue provides intelligent, context-aware recommendations with Hinglish-style explanations, making content discovery fun and engaging.

**Live Demo:** [Add your deployment URL here]  
**GitHub Repository:** [Add your repo URL here]

---

## ✨ Key Features

### 🔍 Intelligent Search
- **Multi-type search** across movies, series, anime, and books
- **Real-time autocomplete** suggestions
- **Smart filtering** by genre, type, and mood
- **Fast, responsive search** with skeleton loading states

### 🤖 AI-Powered Explanations
- **Automated summaries** of plot, themes, and key takeaways
- **Context-aware insights** - why you should watch/read it
- **Reference explanations** - understand cultural and artistic references
- **Hinglish support** - funny, relatable explanation style

### 💾 Personalization
- **Save your favorites** to custom lists
- **View history** tracking with local storage
- **Smart recommendations** based on your taste
- **Share functionality** - Twitter, WhatsApp, native share

### 📱 Modern UI/UX
- **Mobile-first responsive design**
- **Dark theme** optimized for eye comfort
- **Smooth animations** and transitions
- **Lazy-loaded images** for fast performance
- **Loading states** with skeleton screens
- **Error boundaries** and graceful fallbacks

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library with Hooks |
| **Vite 5** | Lightning-fast build tool |
| **Tailwind CSS 3** | Utility-first CSS framework |
| **React Router 6** | Client-side routing |
| **Axios** | HTTP client with interceptors |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js 4** | Web framework |
| **Axios** | API client for external services |
| **Dotenv** | Environment variable management |
| **Express Rate Limit** | API rate limiting |
| **CORS** | Cross-origin resource sharing |

### External APIs
| Service | Usage |
|---------|-------|
| **TMDB (The Movie Database)** | Movies, TV series, anime data |
| **Google Books API** | Book information and metadata |
| **Claude AI API** | Intelligent content explanations |

---

## 📁 Project Structure

```
CurioCue/
├── backend/                    # Express.js backend server
│   ├── routes/                 # API route handlers
│   │   ├── search.js          # Multi-type search endpoint
│   │   ├── title.js           # Title detail & similar items
│   │   ├── explain.js         # AI explanation generation
│   │   ├── availability.js    # Streaming/reading availability
│   │   └── recommendations.js # Smart recommendations
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handling
│   ├── utils/
│   │   ├── apiClient.js       # External API clients
│   │   └── sampleData.js      # Fallback data
│   ├── data/                  # JSON data files
│   ├── server.js              # Express app setup
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/             # Route pages
│   │   │   ├── Home.jsx       # Hero & trending
│   │   │   ├── SearchResults.jsx  # Search results grid
│   │   │   ├── TitleDetails.jsx   # Detailed view
│   │   │   └── SavedList.jsx  # Bookmarked items
│   │   ├── components/        # Reusable UI components
│   │   │   ├── TitleCard.jsx  # Content card
│   │   │   ├── Header.jsx     # Navigation
│   │   │   ├── Footer.jsx     # Footer
│   │   │   ├── ExplainSection.jsx  # AI explanation display
│   │   │   ├── AvailabilityCard.jsx # Where to watch/read
│   │   │   ├── LoadingSpinner.jsx   # Loading state
│   │   │   └── ...
│   │   ├── utils/             # Helper functions
│   │   │   ├── api.js         # Axios instance & requests
│   │   │   ├── storage.js     # LocalStorage wrapper
│   │   │   └── shareUtils.js  # Share functionality
│   │   ├── hooks/             # Custom React hooks
│   │   ├── App.jsx            # Root component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Tailwind + global styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.cjs
│   ├── package.json
│   └── index.html
│
├── .gitignore
├── SETUP.md                   # Detailed setup guide
└── README.md

```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** ([Download](https://nodejs.org/))
- **npm 8+** or **yarn**
- **Git**

### Installation

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/CurioCue.git
cd CurioCue
```

#### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Add API keys (optional for demo):
# TMDB_API_KEY=your_tmdb_key
# GOOGLE_BOOKS_API_KEY=your_google_key
# CLAUDE_API_KEY=your_claude_key

# Start development server
npm run dev
# Server runs on http://localhost:5000
```

#### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file (if needed)
echo "VITE_API_URL=http://localhost:5000/api" > .env.local

# Start development server
npm run dev
# App runs on http://localhost:5173
```

---

## 🔌 API Endpoints

### Search
```
GET /api/search?q=query&type=movie&genre=action&page=1
GET /api/search/suggestions?q=query
```

### Title Details
```
GET /api/title/:type/:id
GET /api/title/:type/:id/similar
```

### Explanations
```
POST /api/explain/:id
Body: { title, plot }
```

### Recommendations
```
GET /api/recommendations?type=movie&mood=exciting&limit=12
POST /api/recommendations/based-on-history
Body: { titleIds: [...] }
```

### Availability
```
GET /api/availability/:id?region=IN
```

---

## 💾 Data Normalization

### Unified Response Format
All items follow a consistent structure regardless of source:

```json
{
  "id": "unique_identifier",
  "type": "movie|series|anime|book",
  "title": "Content Title",
  "year": 2024,
  "rating": 8.5,
  "image": "https://...",
  "summary": "Plot summary",
  "genre": ["action", "drama"]
}
```

### Key Fixes Implemented
✅ **TV/Movie Field Normalization**
- Movies: `title`, `release_date` → `movie`
- TV: `name`, `first_air_date` → `series`

✅ **Type-Based Routing**
- Suggestions include media `type`
- Title detail route: `/title/:type/:id`
- Correct TMDB endpoint selection based on type

✅ **Image Optimization**
- Lazy loading on all images
- Fallback placeholder
- HTTPS enforcement
- Responsive sizes

---

## 📱 Responsive Design

Built with **mobile-first** approach:

| Breakpoint | Device | CSS Class |
|-----------|--------|-----------|
| Default | Mobile | `sm:` |
| 640px | Tablet | `md:` |
| 1024px | Desktop | `lg:` |
| 1280px | Large | `xl:` |

### Performance Optimizations
- ⚡ Image lazy loading
- 🎯 Skeleton screens for loading states
- 📦 Code splitting with Vite
- 🗜️ CSS tree-shaking with Tailwind
- ⏱️ Debounced search suggestions (300ms)
- 🚀 Production build: ~226KB JS (gzipped: ~75KB)

---

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=*

# External APIs (optional)
TMDB_API_KEY=your_key_here
GOOGLE_BOOKS_API_KEY=your_key_here
CLAUDE_API_KEY=your_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Frontend Build
```bash
cd frontend
npm run build        # Production build
npm run preview      # Preview built app
npm run lint         # ESLint check
```

### Backend Testing
```bash
cd backend
npm start            # Production mode
npm run dev          # Development with hot reload
```

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| Frontend Bundle Size | 226.88 kB (JS) |
| Gzipped Size | ~75 KB |
| Module Count | 97 |
| Build Time | ~1.5s |
| API Response Time | < 500ms |

---

## 🎯 Features Implemented

### ✅ Phase 1: Core Features
- [x] Multi-type search (movies, TV, books, anime)
- [x] Real-time autocomplete suggestions
- [x] Title detail pages with rich information
- [x] Genre and type filtering
- [x] Trending/recommendations section

### ✅ Phase 2: Enhancement
- [x] AI-powered explanations via Claude
- [x] Save/bookmark functionality
- [x] Share to social media
- [x] Search history tracking
- [x] Similar titles recommendations

### ✅ Phase 3: Polish
- [x] Mobile-responsive design
- [x] Dark theme optimization
- [x] Loading states & skeleton screens
- [x] Error handling & fallbacks
- [x] Image lazy loading
- [x] Rate limiting

### 🔮 Future Enhancements
- [ ] User authentication & profiles
- [ ] Advanced filters (language, duration, IMDb score)
- [ ] Watchlist with sync across devices
- [ ] User reviews and ratings
- [ ] Dark/light theme toggle
- [ ] PWA (Progressive Web App)
- [ ] Streaming availability by country

---

## 🐛 Known Issues & Fixes

| Issue | Status | Fix |
|-------|--------|-----|
| TV series showing wrong titles | ✅ Fixed | Type-aware field normalization |
| Wrong navigation from suggestions | ✅ Fixed | Type-based route `/title/:type/:id` |
| Missing filter support for books | ✅ Fixed | Removed unsupported filters |
| Image loading performance | ✅ Fixed | Lazy loading + optimization |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 📚 Documentation

- [Setup Guide](./SETUP.md) - Detailed installation & configuration
- [Project Structure](./PROJECT_STRUCTURE.md) - Complete architecture overview
- [API Documentation](./API.md) - Endpoint reference

---

## 👨‍💻 Author

**CurioCue Development Team**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- **TMDB** for comprehensive movie/TV database
- **Google Books API** for book information
- **Claude AI** for intelligent explanations
- **React & Vite** communities for amazing tools
- **Tailwind CSS** for utility-first styling

---

## 📞 Support

- 📧 Email: support@curiocue.dev
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/CurioCue/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/CurioCue/discussions)

---

**Made with ❤️ by CurioCue Team**
