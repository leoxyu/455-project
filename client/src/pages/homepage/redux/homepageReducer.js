import { createSlice } from '@reduxjs/toolkit';

import { } from '../../../components/Oauth/Spotify/spotifyApiThunks';


const initialState = {};

const homepageSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    something: (state, action) => {
    },
  },
  extraReducers: (builder) => {

  }
});

export const { something } = homepageSlice.actions;

export default homepageSlice.reducer;

