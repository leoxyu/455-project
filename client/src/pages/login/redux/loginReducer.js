import { createSlice } from '@reduxjs/toolkit';
import { loginAsync, registerAsync } from './thunks';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    id: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.id = action.payload.id;
    })
    builder.addCase(registerAsync.fulfilled, (state, action) => {
      state.id = action.payload.id;
    })

  }
});

export const { login, signup } = loginSlice.actions;

export default loginSlice.reducer;