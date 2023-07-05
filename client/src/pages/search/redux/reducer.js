import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from './utils';
import { getSpotifyAsync } from './thunks';


// because we get rate limited and have limited search results, we need to query for all possible data
// then filter on server side, then return to client side due to filters
const INITIAL_STATE = {
    spotify: { 'tracks': [], 'albums': [], 'playlists': [] }, // TODO add artists
    youtube: { videos: [], playlists: [] }, // TODO add channels
    unifi: { playlists: [] }, // TODO: add users
    nextPageLink: null,
    getSpotify: REQUEST_STATE.IDLE,
    getYoutube: REQUEST_STATE.IDLE,
    getUnifi: REQUEST_STATE.IDLE,
    errors: null
};







function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    const formattedHours = hours > 0 ? String(hours) : '';
    const formattedMinutes = minutes > 0 ? String(minutes % 60): '0';
    const formattedSeconds = String(seconds % 60);
  
    const parts = [];
    if (formattedHours !== '') {
      parts.push(formattedHours);
    }
    parts.push(formattedMinutes);
    parts.push(formattedSeconds.padStart(2, '0'));
  
    return parts.join(':');
}
  
  


// thumbnailUrl, songName,
//  artistName, views, duration,
//  songLink, platform,
function parseSpotifyTracks(items) {
    return items.map(track => {
        return {
            'songName': track.name,
            'artists': track.artists.map(artist => artist.name),
            'thumbnailUrl': track.album.images[0].url,
            'views': track.popularity, // TODO: change to popularity
            'releaseDate': track.album.release_date,
            // 'albumName': track.album.name,
            'genres': track.genresConcat, //and union with artist genre
            'audioFeatures': track.audioFeatures,
            'duration': formatDuration(track.duration_ms), // convert to min
            'songLink': track.href
        };
});
}

function parseSpotifyAlbums(items) {
    return items.map(album => {
        return {

            'playlistName': album.name,
            'artistName': album.artists.map(artist => artist.name).join(','),
            'thumbnailUrl': album.images[0].url,
            'date': album.release_date,
            'genres': album.genresConcat, //and union with artist genre
            'songs': parseSpotifyTracks(album.tracks.items),
            'duration': album.total_tracks, // convert to min
            'playlistLink': album.href
        };
});
}
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
            state.spotify.tracks = parseSpotifyTracks(action.payload.tracks.items);
            // state.nextPageLink = action.payload.tracks.next;
            

            // state.spotify.albums=action.playload.albums.items;
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
