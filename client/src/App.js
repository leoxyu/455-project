import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/homepage/homePage';
import LoginPage from './pages/login/loginPage';
import SearchPage from './pages/search/searchPage';
import PlaylistsPage from './pages/playlists/playlistsPage';
import { useSelector } from 'react-redux';
import Navbar from './components/nav/nav';
import SongPlayer from './components/player/SongPlayer';

const App = () => {
  const userId = useSelector(state => state.login.id);
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/*"
          element={
            userId ? (
              <div style={{display: "flex"}}>
                <Navbar />
                <div className="main-container">
                  <main>
                    <Routes>
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/playlists" element={<PlaylistsPage />} />
                    </Routes>
                  </main>
                  <footer className="general-player">
                    <SongPlayer/>
                  </footer>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace={true} />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;