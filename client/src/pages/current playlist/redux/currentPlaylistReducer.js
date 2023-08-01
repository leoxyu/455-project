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
            description: "",
            songs: []
        },
        currSongID: null,
    },
    reducers: {
        // loadNewPlaylist: (state, action) => {
        // },
        setCurrSongIdPlaylistPage: (state, action) => {
            console.log("\r\nChanging currSongID in currentPlaylistReducer");
            console.log("\r\nSetting new currSong to: ");
            console.log(action.payload);
            state.currSongID = action.payload;
        },
        setPlaylistPlaylistPage: (state, action) => {
            console.log("\r\nUpdating playlist in currentPlaylistReducer");
            // console.log("\r\nSetting new playlist to: ");
            // console.log(action.payload);
            state.playlist = action.payload;
        }
    },
    extraReducers: (builder) => {

    }
});

export const { 
    setCurrSongIdPlaylistPage, 
    setPlaylistPlaylistPage } = currentPlaylistSlice.actions;

export default currentPlaylistSlice.reducer;