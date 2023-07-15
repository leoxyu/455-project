import { createSlice } from '@reduxjs/toolkit';

import { youtubeLoginThunk } from './Youtube/youtubeApiThunks';

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

const youtubeApiSlice = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
        setAccessTokenYoutube: (state, action) => {
            state.access_token = action.payload;
        },
        setRefreshTokenYoutube: (state, action) => {
            state.refresh_token = action.payload;
        },
        setYoutubeProfile: (state, action) => {
            state.profile = action.payload;
        },
        setYoutubeAuthError: (state, action) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(youtubeLoginThunk.fulfilled, (state, action) => {
            state.profile = action.payload;
        });
    }
});

export const { setAccessTokenYoutube, setRefreshTokenYoutube, setYoutubeAuthError, setYoutubeProfile } = youtubeApiSlice.actions;

export default youtubeApiSlice.reducer;

