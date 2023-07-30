import { createSlice } from '@reduxjs/toolkit';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM, TYPE_TRACK } = require("../../typeConstants.js");

// playlist is an object that contains:
// id: "",
// songs: []
const initialState = {
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
};

const playerSlice = createSlice({
    name: 'player',
    initialState: initialState,
    reducers: {
        setPlaylist: (state, action) => {
            console.log(action.payload);
            state.playlist = action.payload;
        },
        setCurrSongID: (state, action) => {
            console.log("\r\nChanging currSongID in playerReducer");
            console.log("\r\nSetting new currSong to: ");
            console.log(action.payload);
            state.currSongID = action.payload;
        }
    }
});

export const { setPlaylist, setCurrSongID } = playerSlice.actions;

export default playerSlice.reducer;
