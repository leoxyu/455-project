import { createSlice } from '@reduxjs/toolkit';

import { removeTracksFromPlaylist } from './utilFunctions.js'

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM, TYPE_TRACK } = require("../../typeConstants.js");
const { PREV_TRACK, NEXT_TRACK, USER_SELECTION } = require("./constants.js");


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
    lazyloadCache: {
        toBeAddedCache: [],
        toBeRemovedCache: [],

    }
};

const playerSlice = createSlice({
    name: 'player',
    initialState: initialState,
    reducers: {
        setPlaylist: (state, action) => {
            console.log(action.payload);
            state.playlist = action.payload;

            // clear lazyLoad cache: we're playing a new playlist, updates to
            // old playlist are no longer relevant
            state.lazyloadCache.toBeAddedCache = [];
            state.lazyloadCache.toBeRemovedCache = [];
        },
        setCurrSongID: (state, action) => {
            console.log("\r\nChanging currSongID in playerReducer");
            console.log("\r\nSetting new currSong to: ");
            console.log(action.payload);
            state.currSongID = action.payload;
        },
        lazyLoadAddSong: (state, action) => {
            console.log("\r\nAdding songs to add to lazyload cache");
            console.log(action.payload);

            let toBeAdded = action.payload;
            let toBeRemovedCache = state.lazyloadCache.toBeRemovedCache;

            let finalResultAdd = [];

            for (let i = 0; i < toBeAdded.length; i++) {
                const songToAdd = toBeAdded[i];
                const songID = songToAdd.songID;

                // Check if the song is already queued to be removed, and if so, cancel it out
                if (toBeRemovedCache.find((song) => song.songID === songID)) {
                    toBeRemovedCache = toBeRemovedCache.filter((song) => song.songID !== songID);
                } else {
                    finalResultAdd.push(songToAdd);
                }
            }

            state.lazyloadCache.toBeAddedCache.push(...finalResultAdd);
        },
        lazyLoadRemoveSong: (state, action) => {
            console.log("\r\nAdding songs to remove to lazyload cache");
            console.log(action.payload);

            let toBeRemoved = action.payload;
            let toBeAddedCache = state.lazyloadCache.toBeAddedCache;

            let finalResultRem = [];

            for (let i = 0; i < toBeRemoved.length; i++) {
                const songToRemove = toBeRemoved[i];
                const songID = songToRemove.songID;

                // Check if the song is already queued to be added, and if so, cancel it out
                if (toBeAddedCache.find((song) => song.songID === songID)) {
                    toBeAddedCache = toBeAddedCache.filter((song) => song.songID !== songID);
                } else {
                    finalResultRem.push(songToRemove);
                }
            }

            state.lazyloadCache.toBeRemovedCache.push(...finalResultRem);
        },

        lazyLoadClearCache: (state, action) => {
            console.log("\r\nClearing lazyload cache");
            state.lazyloadCache.toBeAddedCache = [];
            state.lazyloadCache.toBeRemovedCache = [];
        },

        lazyLoadUpdatePlaylist: (state, action) => {
            console.log("\r\nUpdating playlist from lazyload cache");
            const isShuffleOn = action.payload.isShuffleOn.current;
            const operation = action.payload.operation;

            const currentPlaylist = Array.from(state.playlist.songs).map((proxyObject) => proxyObject = Object.assign({}, proxyObject));

            // Assume that the add/rem caches have no shared songIDs since we dealt with that possible case in the add/rem cache reducers
            let toBeAddedCache = Array.from(state.lazyloadCache.toBeAddedCache).map((proxyObject) => proxyObject = Object.assign({}, proxyObject));;
            let toBeRemovedCache = Array.from(state.lazyloadCache.toBeRemovedCache).map((proxyObject) => proxyObject = Object.assign({}, proxyObject));;

            // 1.) Calculate the position of the newCurrSong
            let newCurrSong = null;
            let newPlaylist = currentPlaylist.map((song) => song).concat(toBeAddedCache);

            if (operation === USER_SELECTION) {
                // user hit play on track in playlistPage manually, instantly jump to that song.
                // i.e. we don't need to calculate newCurrSong, just jump to the songID of the song the user clicked on.
                // That song the user set was already updated in state.currSongID, so we just use that.
                newPlaylist = removeTracksFromPlaylist(newPlaylist, toBeRemovedCache);
                state.playlist.songs = newPlaylist;
                state.lazyloadCache.toBeAddedCache = [];
                state.lazyloadCache.toBeRemovedCache = [];
                return;

            } else if (isShuffleOn === true) {
                newPlaylist = removeTracksFromPlaylist(newPlaylist, toBeRemovedCache);
                newCurrSong = newPlaylist[Math.floor(Math.random() * newPlaylist.length)];

            } else if (operation === NEXT_TRACK) {
                let currIndex = currentPlaylist.findIndex((song) => song.songID === state.currSongID);
                let hasLoopedOnce = false;

                for (let i = currIndex; i < newPlaylist.length; i++) {
                    if (i !== currIndex && !toBeRemovedCache.some((toBeRemovedSong) => toBeRemovedSong.songID === newPlaylist[i].songID)) {
                        console.log("\r\nfound the next song to play: ", newPlaylist[i]);
                        newCurrSong = newPlaylist[i];
                        break;
                    }

                    if (i === newPlaylist.length - 1 && !hasLoopedOnce) {
                        hasLoopedOnce = true;
                        i = -1; // i gets incremented to 0 at the start of the next loop by the i++
                    }
                }

                newPlaylist = removeTracksFromPlaylist(newPlaylist, toBeRemovedCache);
            } else if (operation === PREV_TRACK) {
                let currIndex = currentPlaylist.findIndex((song) => song.songID === state.currSongID);
                let hasLoopedOnce = false;

                for (let i = currIndex; i >= 0; i--) {
                    if (i !== currIndex && !toBeRemovedCache.some((toBeRemovedSong) => toBeRemovedSong.songID === newPlaylist[i].songID)) {
                        console.log("\r\nfound the previous song to play: ", newPlaylist[i]);
                        newCurrSong = newPlaylist[i];
                        break;
                    }

                    if (i === 0 && !hasLoopedOnce) {
                        hasLoopedOnce = true;
                        i = newPlaylist.length; // i gets decremented to newPlaylist.length - 1 at the start of the next loop by the i--
                    }
                }

                newPlaylist = removeTracksFromPlaylist(newPlaylist, toBeRemovedCache);
            } else {
                console.log("ERROR: invalid operation in lazyLoadUpdatePlaylist");
                newPlaylist = [];
                newCurrSong = null;
            }

            // 2.) Update the player's playlist to the new one + clear cache
            state.playlist.songs = newPlaylist;
            state.currSongID = newCurrSong ? newCurrSong.songID : null;
            state.lazyloadCache.toBeAddedCache = [];
            state.lazyloadCache.toBeRemovedCache = [];
        },
    }
});

export const {
    setPlaylist,
    setCurrSongID,
    lazyLoadAddSong,
    lazyLoadRemoveSong,
    lazyLoadClearCache,
    lazyLoadUpdatePlaylist,
} = playerSlice.actions;

export default playerSlice.reducer;
