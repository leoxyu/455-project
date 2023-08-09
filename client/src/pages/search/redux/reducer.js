import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from './utils';
import {getSpotifyAsync, getNextSpotifyAsync, getSpotifyAlbumByIDAsync, getSpotifyPlaylistByIDAsync, getYoutubeAsync, getNextYoutubeAsync, setSearchTermAsync, getYoutubePlaylistByIDAsync, importYoutubePlaylistByIDAsync } from './thunks';

const INITIAL_STATE = {
  spotify: {
    'tracks': [],
    'albums': [],
    'playlists': [],
    'tracksNext': null,
    'albumsNext': null,
    'playlistsNext': null,
  },
  youtube: {
    'videos': [],
    'playlists': [],
    'videosNext': null,
    'playlistsNext': null,
  },
  unifi: { playlists: [] },
  getSpotify: REQUEST_STATE.IDLE,
  getSpotifyNext: REQUEST_STATE.IDLE,
  getSpotifyCollectionByID: REQUEST_STATE.IDLE,
  getNextSpotifyCollectionByID: REQUEST_STATE.IDLE,

  getYoutube: REQUEST_STATE.IDLE,
  getYoutubeNext: REQUEST_STATE.IDLE,
  getYoutubePlaylistByID: REQUEST_STATE.IDLE,
  importYoutubePlaylistByID: REQUEST_STATE.IDLE,


  getUnifi: REQUEST_STATE.IDLE,
  searchTerm: '',
  setSearchTerm: REQUEST_STATE.IDLE,
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
    builder.addCase(getSpotifyAlbumByIDAsync.pending, (state, action) => {
      state.getSpotifyCollectionByID = REQUEST_STATE.PENDING;
    });
    builder.addCase(getSpotifyAlbumByIDAsync.fulfilled, (state, action) => {
      state.getSpotifyCollectionByID = REQUEST_STATE.FULFILLED;
      const album = action.payload;
      const index = state.spotify.albums.findIndex(
        (item) => item.originId === album.originId);
      if (index !== -1) {
        state.spotify.albums[index] = album;
      }
    });
    builder.addCase(getSpotifyAlbumByIDAsync.rejected, (state, action) => {
      state.getSpotifyCollectionByID = REQUEST_STATE.REJECTED;
      state.errors = action.payload;
    });
    builder.addCase(getSpotifyPlaylistByIDAsync.pending, (state, action) => {
      state.getSpotifyCollectionByID = REQUEST_STATE.PENDING;
    });
    builder.addCase(getSpotifyPlaylistByIDAsync.fulfilled, (state, action) => {
      state.getSpotifyCollectionByID = REQUEST_STATE.FULFILLED;
      const playlist = action.payload;
      const index = state.spotify.playlists.findIndex(
        (item) => item.originId === playlist.originId);
      if (index !== -1) {
        state.spotify.playlists[index] = playlist;
      }
    });
    builder.addCase(getSpotifyPlaylistByIDAsync.rejected, (state, action) => {
      state.getSpotifyCollectionByID = REQUEST_STATE.REJECTED;
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
    builder.addCase(getNextYoutubeAsync.rejected, (state, action) => {
      state.getYoutubeNext = REQUEST_STATE.REJECTED;
      state.errors = action.payload;
    });
    builder.addCase(setSearchTermAsync.pending, (state, action) => {
      state.setSearchTerm = REQUEST_STATE.PENDING;
    });
    builder.addCase(setSearchTermAsync.fulfilled, (state, action) => {
      state.setSearchTerm = REQUEST_STATE.FULFILLED;
      state.searchTerm = action.payload;
    });
    builder.addCase(setSearchTermAsync.rejected, (state, action) => {
      state.setSearchTerm = REQUEST_STATE.REJECTED;
      state.errors = action.payload;
    });
    builder.addCase(getYoutubePlaylistByIDAsync.pending, (state, action) => {
      state.getYoutubePlaylistByID = REQUEST_STATE.PENDING;
    });
    builder.addCase(getYoutubePlaylistByIDAsync.fulfilled, (state, action) => {
      state.getYoutubePlaylistByID = REQUEST_STATE.FULFILLED;
      const playlist = action.payload;
      const index = state.youtube.playlists.findIndex(
        (item) => item.originId === playlist.originId);
      if (index !== -1) {
        state.youtube.playlists[index] = playlist;
      }
    });
    builder.addCase(getYoutubePlaylistByIDAsync.rejected, (state, action) => {
      state.getYoutubePlaylistByID = REQUEST_STATE.REJECTED;
      state.errors = action.payload;
    });
    builder.addCase(importYoutubePlaylistByIDAsync.pending, (state, action) => {
      state.importYoutubePlaylistByID = REQUEST_STATE.PENDING;
    });
    builder.addCase(importYoutubePlaylistByIDAsync.fulfilled, (state, action) => {
      state.importYoutubePlaylistByID = REQUEST_STATE.FULFILLED;
      const playlist = action.payload;
      const index = state.youtube.playlists.findIndex(
        (item) => item.originId === playlist.originId);
      if (index !== -1) {
        state.youtube.playlists[index] = playlist;
      }
    });
    builder.addCase(importYoutubePlaylistByIDAsync.rejected, (state, action) => {
      state.importYoutubePlaylistByID = REQUEST_STATE.REJECTED;
      state.errors = action.payload;
    });
  }
});

export default searchSlice.reducer;
