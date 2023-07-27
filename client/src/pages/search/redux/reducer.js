import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from './utils';
import { getNextSpotifyAsync, getNextYoutubeAsync, getSpotifyAsync, getYoutubeAsync, getYoutubePlaylistByIDAsync } from './thunks';


// because we get rate limited and have limited search results, we need to query for all possible data
// then filter on server side, then return to client side due to filters
const INITIAL_STATE = {
    spotify: {
        'tracks': [],
        'albums': [],
        'playlists': [],
        'tracksNext': null,
        'albumsNext': null,
        'playlistsNext': null,
    }, // TODO add artists
    youtube: {
        'videos': [],
        'playlists': [],
        'videosNext': null,
        'playlistsNext': null,
    },
    unifi: { playlists: [] }, // TODO: add users
    getSpotify: REQUEST_STATE.IDLE,
    getSpotifyNext: REQUEST_STATE.IDLE,
    getYoutube: REQUEST_STATE.IDLE,
    getYoutubeNext: REQUEST_STATE.IDLE,
    getUnifi: REQUEST_STATE.IDLE,
    errors: null
};


const searchSlice = createSlice({
    name: 'search',
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getSpotifyAsync.pending, (state, action) => {
            state.getSpotify = REQUEST_STATE.PENDING;
        });
        builder.addCase(getSpotifyAsync.fulfilled, (state, action) => {
            state.getSpotify = REQUEST_STATE.FULFILLED;

            if ('tracks' in action.payload) {
                state.spotify.tracks = action.payload.tracks.items;
                state.spotify.tracksNext = action.payload.tracks.next;
            }

            if ('albums' in action.payload) {
                state.spotify.albums = action.payload.albums.items;
                state.spotify.albumsNext = action.payload.albums.next;
            }

            if ('playlists' in action.payload) {
                state.spotify.playlists = action.payload.playlists.items;
                state.spotify.playlistsNext = action.payload.playlists.next;
            }
        });
        builder.addCase(getSpotifyAsync.rejected, (state, action) => {
            state.getSpotify = REQUEST_STATE.REJECTED;
            state.errors = action.payload;
        });
        builder.addCase(getNextSpotifyAsync.pending, (state, action) => {
            state.getSpotifyNext = REQUEST_STATE.PENDING;
        });
        builder.addCase(getNextSpotifyAsync.fulfilled, (state, action) => {
            state.getSpotifyNext = REQUEST_STATE.FULFILLED;

            if ('tracks' in action.payload) {
                state.spotify.tracks = [...state.spotify.tracks, ...action.payload.tracks.items];
                state.spotify.tracksNext = action.payload.tracks.next;
            }

            if ('albums' in action.payload) {
                state.spotify.albums = [...state.spotify.albums, ...action.payload.albums.items];
                state.spotify.albumsNext = action.payload.albums.next;
            }

            if ('playlists' in action.payload) {
                state.spotify.playlists = [...state.spotify.playlists, ...action.payload.playlists.items];
                state.spotify.playlistsNext = action.payload.playlists.next;
            }

        });
        builder.addCase(getNextSpotifyAsync.rejected, (state, action) => {
            state.getSpotifyNext = REQUEST_STATE.REJECTED;
            state.errors = action.payload;
        });
        builder.addCase(getYoutubeAsync.pending, (state, action) => {
            state.getYoutube = REQUEST_STATE.PENDING;
        });
        builder.addCase(getYoutubeAsync.fulfilled, (state, action) => {
            state.getYoutube = REQUEST_STATE.FULFILLED;
            if ('videos' in action.payload) {
                state.youtube.videos = action.payload.videos.items;
                state.youtube.videosNext = action.payload.videos.next;
            }
            if ('playlists' in action.payload) {
                state.youtube.playlists = action.payload.playlists.items;
                state.youtube.playlistsNext = action.payload.playlists.next;
            }
        });
        builder.addCase(getYoutubeAsync.rejected, (state, action) => {
            state.getYoutube = REQUEST_STATE.REJECTED;
            state.errors = action.payload;
        });
        builder.addCase(getNextYoutubeAsync.pending, (state, action) => {
            state.getYoutubeNext = REQUEST_STATE.PENDING;
        });
        builder.addCase(getNextYoutubeAsync.fulfilled, (state, action) => {
            state.getYoutubeNext = REQUEST_STATE.FULFILLED;
            if ('videos' in action.payload) {
                state.youtube.videos = [...state.youtube.videos, ...action.payload.videos.items];
                state.youtube.videosNext = action.payload.videos.next;
            }
            if ('playlists' in action.payload) {
                state.youtube.playlists = [...state.youtube.playlists, ...action.payload.playlists.items];
                state.youtube.playlistsNext = action.payload.playlists.next;
            }
        });

        // builder.addCase(getYoutubePlaylistByIDAsync.fulfilled, (state, action) => {
        // this is prob not needed
        // });

        // builder.addCase(getUnifiAsync.pending, (state, action) => {
        //     state.getUnifi = REQUEST_STATE.PENDING;
        // });
        // builder.addCase(getUnifiAsync.fulfilled, (state, action) => {
        //     state.getUnifi = REQUEST_STATE.FULFILLED;
        //     state.unifiPlaylists = action.payload;
        // });
        // builder.addCase(getUnifiAsync.rejected, (state, action) => {
        //     state.getUnifi = REQUEST_STATE.REJECTED;
        //     state.errors = action.payload;
        // });
    }
});


export default searchSlice.reducer;
