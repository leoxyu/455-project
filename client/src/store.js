import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './pages/login/redux/loginReducer';

export const store = configureStore({
    reducer: {
      login: loginReducer
    },
    devTools: true
  });