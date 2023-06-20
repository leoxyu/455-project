import { createSlice } from '@reduxjs/toolkit';

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
});

export const { login, signup } = loginSlice.actions;

export default loginSlice.reducer;