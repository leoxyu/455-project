import { createSlice } from '@reduxjs/toolkit';
import { loginAsync, registerAsync } from '../pages/login/redux/thunks';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    id: null,
  },
  reducers: {
    login: (state, action) => {
      state.id = action.payload.userId;
    },
    signup: (state, action) => {
      state.id = action.payload.userId;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      console.log(action);
      state.id = action.payload.id;
    })
    builder.addCase(registerAsync.fulfilled, (state, action) => {
      state.id = null;
      console.log('REGISTERED');
    })

  }
});

export const { login, signup } = loginSlice.actions;

export default loginSlice.reducer;