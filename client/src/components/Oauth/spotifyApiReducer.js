import { createSlice } from '@reduxjs/toolkit';

import { spotifyProfileThunk } from './Spotify/spotifyApiThunks';

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
        setAccessTokenSpotify: (state, action) => {
            state.access_token = action.payload;
        },
        setRefreshTokenSpotify: (state, action) => {
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
        builder.addCase(spotifyProfileThunk.fulfilled, (state, action) => {
            state.profile = action.payload;
        });
    }
});

export const { setAccessTokenSpotify, setRefreshTokenSpotify, setSpotifyAuthError, setSpotifyProfile } = spotifyApiSlice.actions;

export default spotifyApiSlice.reducer;

