import { createSlice } from '@reduxjs/toolkit';
import { loginAsync, registerAsync } from './thunks';

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    id: null,
  },
  reducers: {
    logout: (state) => {
      console.log('inside reducer')
      console.log(state)
      state.id = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.id = action.payload.id;
    })
    builder.addCase(registerAsync.fulfilled, (state, action) => {
      state.id = action.payload.id;
    })

  }
});

export const { logout } = loginSlice.actions;

export default loginSlice.reducer;