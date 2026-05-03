import React from "react";

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
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/saved" className="hover:text-white transition">
                  Saved
                </a>
              </li>
            </ul>
          </div>

          {/* Content Types */}
          <div>
            <h4 className="font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a href="/?type=movie" className="hover:text-white transition">
                  Movies
                </a>
              </li>
              <li>
                <a href="/?type=series" className="hover:text-white transition">
                  Series
                </a>
              </li>
              <li>
                <a href="/?type=anime" className="hover:text-white transition">
                  Anime
                </a>
              </li>
              <li>
                <a href="/?type=book" className="hover:text-white transition">
                  Books
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow</h4>
            <div className="flex gap-4 items-center">
              <a
                href="https://github.com/ShivamRai700"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition hover:scale-110"
                title="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.94 3.2 9.13 7.64 10.61.56.1.76-.24.76-.54 0-.27-.01-1.16-.02-2.1-3.11.68-3.77-1.34-3.77-1.34-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1.01 1.73 2.66 1.23 3.31.94.1-.73.4-1.23.73-1.51-2.48-.28-5.09-1.24-5.09-5.51 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.4.11-2.92 0 0 .95-.3 3.11 1.15a10.8 10.8 0 0 1 5.66 0c2.16-1.45 3.11-1.15 3.11-1.15.61 1.52.23 2.64.11 2.92.72.78 1.16 1.78 1.16 3 0 4.28-2.61 5.23-5.1 5.5.41.36.77 1.07.77 2.16 0 1.56-.01 2.82-.01 3.2 0 .3.2.65.77.54A11.26 11.26 0 0 0 23.25 11.75C23.25 5.48 18.27.5 12 .5z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/shivam-rai-485586203"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition hover:scale-110"
                title="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.8v2.2h.05c.53-1 1.84-2.2 3.8-2.2 4.06 0 4.8 2.67 4.8 6.14V24h-4v-7.5c0-1.8-.03-4.1-2.5-4.1-2.5 0-2.9 1.95-2.9 4v7.6h-4V8z" />
                </svg>
              </a>
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