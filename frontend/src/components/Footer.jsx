import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">CurioCue</h3>
            <p className="text-slate-400 text-sm">
              A smart, funny guide to what to watch, read, or discover next.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/saved" className="hover:text-white transition">Saved</a></li>
            </ul>
          </div>

          {/* Content Types */}
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/?type=movie" className="hover:text-white transition">Movies</a></li>
              <li><a href="/?type=series" className="hover:text-white transition">Series</a></li>
              <li><a href="/?type=anime" className="hover:text-white transition">Anime</a></li>
              <li><a href="/?type=book" className="hover:text-white transition">Books</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow</h4>
            <div className="flex gap-4">
              <a href="#" className="text-2xl hover:scale-110 transition">𝕏</a>
              <a href="#" className="text-2xl hover:scale-110 transition">📱</a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <p className="text-slate-400 text-sm text-center">
            © {currentYear} CurioCue. Created with ❤️ for curious minds.
            <br />
            We only recommend legal, free, and official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
