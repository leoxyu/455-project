import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './pages/login/redux/loginReducer';
import homepageReducer from './pages/homepage/redux/homepageReducer';
import oauthReducer from './components/Oauth/oauthReducer';
import playlistsReducer from './components/home/redux/playlistsReducer';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    homepage: homepageReducer,
    oauth: oauthReducer,
    playlists: playlistsReducer
  },
  devTools: true
});