import { createAsyncThunk } from "@reduxjs/toolkit";
import { spotifyOauthPkce } from './script.ts';

export const spotifyOauthThunk = createAsyncThunk(
    'DO_SPOTIFY_OAUTH',
    async () => {
      return await spotifyOauthPkce();
    }
  );