import { createSlice } from '@reduxjs/toolkit';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../../../typeConstants.js");

const currentPlaylistSlice = createSlice({
    name: 'currentPlaylistPage',
    initialState: {
        // playlist: {
        //     id: "",
        //     playlistName: "",
        //     thumbnailUrl: "",
        //     releaseDate: "",
        //     duration: 0,
        //     artistName: "",
        //     isFavorited: false,
        //     source: "",
        //     type: "",
        //     songs: []
        // },
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
        }
    },
    extraReducers: (builder) => {

    }
});

export const { setCurrSongIdPlaylistPage } = currentPlaylistSlice.actions;

export default currentPlaylistSlice.reducer;