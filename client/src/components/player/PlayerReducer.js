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
        songs: []
    },
    currSong: "",
};

const playerSlice = createSlice({
    name: 'player',
    initialState: initialState,
    reducers: {
        setPlaylist: (state, action) => {
            console.log(action.payload);
            state.playlist = action.payload;
        }
    }
});

export const { setPlaylist } = playerSlice.actions;

export default playerSlice.reducer;
