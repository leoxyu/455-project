import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom';

import HomePage from './pages/homepage/homePage';
import LoginPage from './pages/login/loginPage';
import SearchPage from './pages/search/searchPage';
import PlaylistsPage from './pages/playlists/playlistsPage';
import CurrentPlaylistPage from './pages/current playlist/currentPlaylistPage';
import SongPage from './pages/songs/songPage';

import { useSelector } from 'react-redux';
import Navbar from './components/nav/nav';
import SongPlayer from './components/player/SongPlayer';

import Menu from './components/nav/navBar';

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
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/songs" element={<SongPage />} />
                      <Route path="/playlists" element={<PlaylistsPage />} />
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