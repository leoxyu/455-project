import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './pages/login/redux/loginReducer';
import homepageReducer from './pages/homepage/redux/homepageReducer';
import spotifyReducer from './components/Oauth/spotifyApiReducer';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    homepage: homepageReducer,
    spotify: spotifyReducer
  },
  devTools: true
});