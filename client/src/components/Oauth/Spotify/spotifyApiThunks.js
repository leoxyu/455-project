import { createAsyncThunk } from "@reduxjs/toolkit";
import { spotifyLogin, spotifyGetProfile, spotifyGetManyPlaylists } from "./spotifyApiActions.js";

export const spotifyLoginThunk = createAsyncThunk(
  'SPOTIFY_LOGIN',
  async () => {
    return await spotifyLogin();
  }
);

export const spotifyProfileThunk = createAsyncThunk(
  'SPOTIFY_PROFILE',
  async () => {
    return await spotifyGetProfile();
  }
);

