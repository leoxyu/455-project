import { createSlice } from '@reduxjs/toolkit';
import { getHashParams } from './Spotify/spotifyUtil';

import { spotifyGetAccessTokenThunk, spotifyFetchProfileThunk, spotifyRedirectToAuthCodeFlowThunk } from './Spotify/spotifyOauthThunks';

// =================================================================================>
// parameters for spotify OAuth
// =================================================================================>

// let params = getHashParams();

let access_token = null;
let refresh_token = null;
let error = null;



const initialState = {
    access_token: access_token,
    refresh_token: refresh_token,
    error: error,
    profile: null
};

const spotifyApiSlice = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.access_token = action.payload;
        },
        setRefreshToken: (state, action) => {
            state.refresh_token = action.payload;
        },
        setSpotifyProfile: (state, action) => {
            state.profile = action.payload;
        },
        setSpotifyAuthError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        // builder.addCase(spotifyRedirectToAuthCodeFlowThunk.fulfilled, (state, action) => {
        //     // I don't think we need to do anything special for this case

        // });
    }
});

export const { setAccessToken, setRefreshToken, setSpotifyAuthError, setSpotifyProfile } = spotifyApiSlice.actions;

export default spotifyApiSlice.reducer;

