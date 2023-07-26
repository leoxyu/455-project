import { createSlice } from '@reduxjs/toolkit';
const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM, TYPE_TRACK } = require("../../typeConstants.js");
const initialState = {
    playlist: {
        playlistID: "",

        playlistName: "",
        coverUrl: "",
        releaseDate: "",
        duration: 0, // IF   duration is string: playlist is just 1 song
                     // ELSE duration is a number: duration = # songs
        artists: [],
        isFavorite: false,
        type: null, // TYPE_PLAYLIST, TYPE_ALBUM or TYPE_TRACK

        songs: []
    }
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
