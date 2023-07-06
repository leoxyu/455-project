import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from './utils';
import { getSpotifyAsync } from './thunks';


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
    youtube: { videos: [], playlists: [] }, // TODO add channels
    unifi: { playlists: [] }, // TODO: add users
    getSpotify: REQUEST_STATE.IDLE,
    getYoutube: REQUEST_STATE.IDLE,
    getUnifi: REQUEST_STATE.IDLE,
    errors: null
};





// https://developer.spotify.com/documentation/web-api/reference/get-recommendations
// -> good initial query for recommendations on home page




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
            state.spotify.tracks = action.payload.tracks.items;
            state.spotify.tracksNext = action.payload.tracks.next;
            // state.nextPageLink = action.payload.tracks.next;
            
            // console.log(action.payload.albums)
            state.spotify.albums=action.payload.albums.items;
            state.spotify.albumsNext = action.payload.albums.next;
            // state.spotify.albums = parseSpotifyAlbums(action.payload.albums.items);
            // console.log(JSON.stringify(state.spotify.albums[0]));

            
            // state.spotify.artists = action.payload.artists;
            // state.getSpotify.playlists = action.payload.playlists;
        });
        builder.addCase(getSpotifyAsync.rejected, (state, action) => {
            state.getSpotify = REQUEST_STATE.REJECTED;
            state.errors = action.payload;
        });
        // builder.addCase(getYoutubeAsync.pending, (state, action) => {
        //     state.getYoutube = REQUEST_STATE.PENDING;
        // });
        // builder.addCase(getYoutubeAsync.fulfilled, (state, action) => {
        //     state.getYoutube = REQUEST_STATE.FULFILLED;
        //     state.youtubeVideos = action.payload.videos;
        //     state.youtubePlaylists = action.payload.playlists;
        //     state.youtubeChannels = action.payload.channels;
        // });
        // builder.addCase(getYoutubeAsync.rejected, (state, action) => {
        //     state.getYoutube = REQUEST_STATE.REJECTED;
        //     state.errors = action.payload;
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
