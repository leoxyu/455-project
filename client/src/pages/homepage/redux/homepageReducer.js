import { createSlice } from '@reduxjs/toolkit';

import { spotifyOauthThunk } from '../../../components/Oauth/Spotify/spotifyOauthThunks';


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

