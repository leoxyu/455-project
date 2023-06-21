import { createSlice } from '@reduxjs/toolkit';

import { spotifyGetAccessTokenThunk, spotifyFetchProfile, spotifyRedirectToAuthCodeFlowThunk } from './Spotify OAuth/spotifyOauthThunks';

// =================================================================================>
// parameters for spotify OAuth
// clientId should not be hard-coded on client side, move to server side later on
// =================================================================================>
const clientId = "a1205770b15144e0a77fff7882931779"
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

const initialState = {
    clientId: clientId,
    code: code,          // I don't really know what this parameter is for, but OAuth needs it to check if we've already finished OAuth or not
    accessToken: null,
    profile: null
};

const oauthSlice = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(spotifyRedirectToAuthCodeFlowThunk.fulfilled, (state, action) => {
            // I don't think we need to do anything special for this case
            console.log(state);
        });

        builder.addCase(spotifyGetAccessTokenThunk.fulfilled, (state, action) => {
            console.log(state);

        });

        builder.addCase(spotifyFetchProfile.fulfilled, (state, action) => {
            console.log(state);
        });
    }
});

export const { } = oauthSlice.actions;

export default oauthSlice.reducer;

