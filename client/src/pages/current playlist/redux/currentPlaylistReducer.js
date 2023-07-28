import { createSlice } from '@reduxjs/toolkit';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../../../typeConstants.js");

const currentPlaylistSlice = createSlice({
    name: 'currentPlaylistPage',
    initialState: {

        playlist: {
            id: "",
            playlistName: "",
            thumbnailUrl: "",
            releaseDate: "",
            duration: 0,
            artistName: "",
            isFavorite: false,
            source: "",
            type: "",
            songs: []
        },
        currSong: null
    },
    reducers: {
        loadNewPlaylist: (state, action) => {
        },
    },
    extraReducers: (builder) => {

    }
});

export const { } = currentPlaylistSlice.actions;

export default currentPlaylistSlice.reducer;