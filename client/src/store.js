import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './pages/login/redux/loginReducer';
import homepageReducer from './pages/homepage/redux/homepageReducer';
import spotifyReducer from './components/Oauth/spotifyApiReducer';
import playlistsReducer from './components/home/redux/playlistsReducer';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    homepage: homepageReducer,
    spotify: spotifyReducer,
    playlists: playlistsReducer
  },
  devTools: true
});