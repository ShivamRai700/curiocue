import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSavedTitles } from "../utils/storage";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const navigate = useNavigate();

  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    setSavedCount(getSavedTitles().length);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMenuOpen(false); // close menu after search
    }
  };

  const [showHeader, setShowHeader] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // show/hide header
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      // shadow on scroll
      setScrolled(currentScrollY > 10);

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 
      ${showHeader ? "translate-y-0" : "-translate-y-full"}
      ${scrolled ? "shadow-md bg-slate-900/95" : "bg-slate-900"}
      border-b border-slate-800`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="text-2xl">🎬</div>
          <h1 className="font-bold text-xl gradient-text hidden sm:block">
            CurioCue
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          <Link
            to="/saved"
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-700 transition relative group"
            title="Saved Items"
          >
            <span className="text-xl">❤️</span>
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </nav>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 flex flex-col gap-3">
          <Link to="/saved" onClick={() => setMenuOpen(false)}>
            ❤️ Saved
          </Link>
        </div>
      )}
    </header>
  );
}