import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const homepageSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {},
});

export const { something } = homepageSlice.actions;

export default homepageSlice.reducer;
