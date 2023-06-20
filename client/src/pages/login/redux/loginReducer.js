import { createSlice } from '@reduxjs/toolkit';
import { loginAsync, registerAsync } from './thunks';

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
			state.id = null;
		})
		builder.addCase(registerAsync.fulfilled, (state, action) => {
			state.id = null;
		})
		
	}
});

export const { login, signup } = loginSlice.actions;

export default loginSlice.reducer;