import { createAsyncThunk } from "@reduxjs/toolkit";
import { } from './spotifyApiActions.js';
import { spotifyLogin } from "./spotifyApiActions.js";

export const spotifyLoginThunk = createAsyncThunk(
  'SPOTIFY_LOGIN',
  async () => {
    return await spotifyLogin();
  }
);

// export const spotifyRedirectToAuthCodeFlowThunk = createAsyncThunk(
//   'SPOTIFY_REFRESH_TOKEN',
//   async ({clientId, statePayload}) => {
//     // return await redirectToAuthCodeFlow({clientId, statePayload});
//   }
// );

// export const spotifyFetchProfileThunk = createAsyncThunk(
//   'SPOTIFY_FETCH_PROFILE',
//   async (accessToken) => {
//     // return await fetchProfile(accessToken);
//   }
// );

