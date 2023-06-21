import { createAsyncThunk } from "@reduxjs/toolkit";
import { } from './spotifyApiActions.js';
import { getAccessToken, redirectToAuthCodeFlow } from './authCodeWithPkce.js'
import { fetchProfile } from "./spotifyApiActions.js";

// export const spotifyOauthThunk = createAsyncThunk(
//     'DO_SPOTIFY_OAUTH',
//     async () => {
//       return await spotifyOauthPkce();
//     }
// );

export const spotifyGetAccessTokenThunk = createAsyncThunk(
    'GET_SPOTIFY_ACCESS_TOKEN',
    async ({clientId, code}) => {
      return await getAccessToken({clientId, code});
    }
);

export const spotifyRedirectToAuthCodeFlowThunk = createAsyncThunk(
    'SPOTIFY_REDIRECT_OAUTH',
    async (clientId) => {
      return await redirectToAuthCodeFlow(clientId);
    }
);

export const spotifyFetchProfile = createAsyncThunk(
    'SPOTIFY_FETCH_PROFILE',
    async (accessToken) => {
      return await fetchProfile(accessToken);
    }
);

