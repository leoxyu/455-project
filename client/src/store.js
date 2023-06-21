import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './pages/login/redux/loginReducer';
import homepageReducer from './pages/homepage/redux/homepageReducer';
import oauthReducer from './components/Oauth/oauthReducer';

export const store = configureStore({
    reducer: {
      login: loginReducer,
      homepage: homepageReducer,
      oauth: oauthReducer
    },
    devTools: true
  });