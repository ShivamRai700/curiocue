export const sampleTitles = [
  {
    id: 'movie_1',
    type: 'movie',
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    image: 'https://via.placeholder.com/300x450?text=Inception',
    summary: 'Ek mind-bending heist jo dreams ke andar chalti hai. Nolan ka masterpiece jo aapka dimaag ghuma dega!',
    plot: 'A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
    whyWorthIt: 'Mind-bending concept + Hans Zimmer ka iconic music + DiCaprio ka brilliant acting',
    themes: ['Reality vs illusion', 'Inception of ideas', 'Corporate espionage', 'Subconscious mind'],
    genre: ['Sci-Fi', 'Thriller', 'Action'],
    duration: 148,
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Ellen Page'],
    trickyWords: [
      { word: 'Limbo', explanation: 'A dream space stuck in time, no way out unless you die' },
      { word: 'Extraction', explanation: 'Stealing secrets from someone\'s mind during dreams' }
    ],
    ending: 'The spinning top ambiguity - did Cobb wake up or is he still dreaming? Nolan won\'t tell!',
    recommendations: ['The Matrix', 'Memento', 'Interstellar', 'Tenet'],
    availability: [
      { platform: 'Netflix', type: 'subscription', url: '#', quality: '4K' },
      { platform: 'Amazon Prime', type: 'free-with-ads', url: '#', quality: 'HD' }
    ]
  },
  {
    id: 'series_1',
    type: 'series',
    title: 'Breaking Bad',
    year: 2008,
    rating: 9.5,
    image: 'https://via.placeholder.com/300x450?text=BreakingBad',
    summary: 'Ek chemistry teacher jo meth dealer ban jata hai. Dark, intense, aur completely binge-worthy!',
    plot: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to cooking methamphetamine with a former student to secure his family\'s financial future.',
    whyWorthIt: 'One of the greatest shows ever made - perfect storytelling from start to finish',
    themes: ['Moral decay', 'Power and corruption', 'Identity', 'Family'],
    genre: ['Crime', 'Drama', 'Thriller'],
    seasons: 5,
    episodes: 62,
    director: 'Vince Gilligan',
    cast: ['Bryan Cranston', 'Aaron Paul', 'Anna Gunn'],
    trickyWords: [
      { word: 'Blue Meth', explanation: 'Crystal methamphetamine with distinctive blue color - signature product' },
      { word: 'Cook', explanation: 'Process of making drugs in the context of this show' }
    ],
    ending: 'Everything comes full circle - intense, emotional, and perfectly satisfying conclusion',
    recommendations: ['Ozark', 'The Wire', 'Narcos', 'Better Call Saul'],
    availability: [
      { platform: 'Netflix', type: 'subscription', url: '#', quality: '4K' },
      { platform: 'Apple TV', type: 'buy', url: '#', quality: '4K' }
    ]
  },
  {
    id: 'anime_1',
    type: 'anime',
    title: 'Death Note',
    year: 2006,
    rating: 9.0,
    image: 'https://via.placeholder.com/300x450?text=DeathNote',
    summary: 'Ek notebook jo jo bhi name likha jaye, woh mar jaye. Genius aur madness ka talamel!',
    plot: 'A high school student discovers a supernatural notebook that kills anyone whose name is written in it, and begins using it to eliminate criminals.',
    whyWorthIt: 'Cat-and-mouse psychological thriller between two geniuses',
    themes: ['Justice vs morality', 'Power corruption', 'Good vs evil', 'Obsession'],
    genre: ['Psychological', 'Supernatural', 'Thriller'],
    episodes: 37,
    studios: 'Madhouse',
    trickyWords: [
      { word: 'Shinigami', explanation: 'Death god - immortal creatures who drop Death Notes to the human world' },
      { word: 'Death Note', explanation: 'A supernatural notebook used to kill people by writing their names' }
    ],
    ending: 'A conclusion that questions whether justice was served or if evil prevailed',
    recommendations: ['Code Geass', 'Psycho-Pass', 'Monster', 'The Promised Neverland'],
    availability: [
      { platform: 'Netflix', type: 'subscription', url: '#', quality: 'HD' },
      { platform: 'Crunchyroll', type: 'subscription', url: '#', quality: 'HD' }
    ]
  },
  {
    id: 'book_1',
    type: 'book',
    title: 'The Midnight Library',
    year: 2020,
    rating: 8.5,
    image: 'https://via.placeholder.com/300x450?text=MidnightLibrary',
    summary: 'Ek library jo infinite lives dikhata hai - life\'s what-ifs explore karo par regret bhulke!',
    plot: 'A woman on the brink of death finds herself in a magical library that allows her to explore alternate versions of her life based on different choices.',
    whyWorthIt: 'Philosophical, heartwarming, and forces you to think about your own life choices',
    themes: ['Regret', 'Second chances', 'Life choices', 'Meaning of happiness'],
    genre: ['Fantasy', 'Contemporary', 'Philosophy'],
    author: 'Matt Haig',
    pages: 304,
    trickyWords: [
      { word: 'Parallel lives', explanation: 'Different versions of your life that could exist based on different decisions' },
      { word: 'Quantum mechanics', explanation: 'Scientific theory that connects to the concept of infinite possibilities' }
    ],
    ending: 'A life-affirming conclusion about choosing the life you have and making it meaningful',
    recommendations: ['Before the Coffee Gets Cold', 'The Invisible Life of Addie LaRue', 'Piranesi', 'A Man Called Ove'],
    availability: [
      { platform: 'Kindle', type: 'buy', url: '#', price: '$9.99' },
      { platform: 'Audible', type: 'subscription', url: '#', quality: 'Audiobook' },
      { platform: 'Library', type: 'free', url: '#', quality: 'Physical/eBook' }
    ]
  }
];

export const filters = [
  { id: 'weekend-watch', label: '🍿 Weekend Watch', icon: '🍿' },
  { id: 'short-binge', label: '⚡ Short Binge', icon: '⚡' },
  { id: 'emotional', label: '😭 Emotional', icon: '😭' },
  { id: 'mind-blowing', label: '🤯 Mind-Blowing', icon: '🤯' },
  { id: 'easy-watch', label: '😌 Easy Watch', icon: '😌' },
  { id: 'brainy', label: '🧠 Brainy', icon: '🧠' }
];

export const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Crime',
  'Adventure'
];

export const moods = [
  'Happy',
  'Sad',
  'Inspired',
  'Thrilled',
  'Relaxed',
  'Thoughtful',
  'Excited',
  'Contemplative'
];
