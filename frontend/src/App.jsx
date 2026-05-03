import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import TitleDetails from './pages/TitleDetails';
import BookDetails from './pages/BookDetails';
import SavedList from './pages/SavedList';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark text-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/title/:type/:id" element={<TitleDetails />} />
            <Route path="/title/:id" element={<TitleDetails />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/saved" element={<SavedList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
