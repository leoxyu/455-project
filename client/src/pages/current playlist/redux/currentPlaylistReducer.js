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
        },
        removeSong: (state, action) => {
            console.log("\r\nRemoving song from playlist in currentPlaylistReducer");
            let currentPlaylist = Array.from(state.playlist.songs).map((proxyObject) => proxyObject = Object.assign({}, proxyObject));
            state.playlist.songs = currentPlaylist.filter((song) => song.songID !== action.payload);
        },
        addSong: (state, action) => {
            console.log("\r\nAdding song to playlist in currentPlaylistReducer");
            let currentPlaylist = Array.from(state.playlist.songs).map((proxyObject) => proxyObject = Object.assign({}, proxyObject));
            currentPlaylist.push(action.payload);
            state.playlist.songs = currentPlaylist;
        }
    },
    extraReducers: (builder) => {

    }
});

export const {
    setCurrSongIdPlaylistPage,
    setPlaylistPlaylistPage,
    removeSong,
    addSong
} = currentPlaylistSlice.actions;

export default currentPlaylistSlice.reducer;