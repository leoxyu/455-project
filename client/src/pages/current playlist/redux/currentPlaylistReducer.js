import { createSlice } from '@reduxjs/toolkit';

export const TYPE_SPOTIFY = "spotify_playlist";
export const TYPE_YOUTUBE = "youtube_playlist";


const currentPlaylistSlice = createSlice({
    name: 'currentPlaylist',
    initialState: {

        currentPlaylist: {
            
            playlistLink: null,
            playlistObjectId: null,
            playlistName: null,
            author: null,
            year: null,
            type: "",
            coverUrl: null,
            numTracks: 0,
            totalDuration: 0,
            tracks: []
        },

        currentTrack: null
    },
    reducers: {
        loadNewPlaylist: (state, action) => {
            state
        },
    },
    extraReducers: (builder) => {

    }
});

export const { } = currentPlaylistSlice.actions;

export default currentPlaylistSlice.reducer;