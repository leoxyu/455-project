import React from 'react';
import { Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';
import './styles/variables.css';
import HomePage from './pages/homepage/homePage';
import LoginPage from './pages/login/loginPage';
import SearchPage from './pages/search/searchPage';
import CurrentPlaylistPage from './pages/current playlist/currentPlaylistPage';
import LibraryPage from './pages/library/libraryPage';

import { useSelector } from 'react-redux';
import Navbar from './components/nav/nav';
import SongPlayer from './components/player/SongPlayer';
import Preload from './pages/login/preload';

const App = () => {
  const userId = useSelector(state => state.login.id);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/*"
          element={
            userId ? (
              <div className="page-container">
                <Navbar />
                <div className="main-container">
                  <main>
                    <Routes>
                      <Route path="/preload" element={<Preload />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/library" element={<LibraryPage />} />
                      <Route path="/playlists/:id" element={<CurrentPlaylistPage />} />
                    </Routes>
                  </main>
                  <footer className="general-player">
                    <SongPlayer />
                  </footer>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace={true} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
