import { createSlice } from '@reduxjs/toolkit';
import { createPlaylistAsync, 
  deletePlaylistAsync, 
  editPlaylistAsync, 
  addSongAsync, 
  getPlaylistsAsync, 
  removeSongAsync, 
  getSongsAsync,
  getOnePlaylist
 } from './thunks';

/*
ACTIONS:

createPlaylist:         {type: ..., payload: {name, initialSongs}}
deletePlaylist:         {type: ..., payload: {playlistID}}
editPlaylist: {type: ..., payload: {playlistID}}
getPlaylists

addSong:                {type: ..., payload: {playlistID, songID}}
removeSong:             {type: ..., payload: {playlistID, songID}}
getSongs:               {type: ..., payload: {playlistID, songID}}    
toggleFavoriteSong:     {type: ..., payload: {songID}}

*/

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState: {
    playlists: [],
    lastId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createPlaylistAsync.fulfilled, (state, action) => {
      state.playlists.push(action.payload);
    })
    builder.addCase(deletePlaylistAsync.fulfilled, (state, action) => {
      state.playlists = state.playlists.filter((i) => i.playlistID !== action.payload);
    })
    builder.addCase(editPlaylistAsync.fulfilled, (state, action) => {
      // Find the edited playlist in the state and update its properties
      const idx = state.playlists.findIndex((playlist) => playlist.playlistID === action.payload.playlistID);
      state.playlists[idx] = action.payload;
    });
    builder.addCase(getPlaylistsAsync.fulfilled, (state, action) => {
      // console.log('action payload', action.payload);
      state.playlists = [...state.playlists, ...action.payload.data];
      state.lastId = action.payload.lastId;
    });
    builder.addCase(getOnePlaylist.fulfilled, (state, action) => {
      const { playlistID } = action.payload;
      const idx = state.playlists.findIndex((pl) => pl.playlistID === playlistID);
      state.playlists[idx] = action.payload;
    });
    builder.addCase(addSongAsync.fulfilled, (state, action) => {
      const { playlistID, song } = action.payload;
      const playlist = state.playlists.find((playlist) => playlist.playlistID === playlistID);
      if (playlist) {
        playlist.songs.push(song);
      }
    });
    builder.addCase(removeSongAsync.fulfilled, (state, action) => {
      const { playlistID, songID } = action.payload;
      const playlist = state.playlists.find((playlist) => playlist.playlistID === playlistID);
      if (playlist) {
        playlist.songs = playlist.songs.filter((song) => song !== songID);
      }
    });
    builder.addCase(getSongsAsync.fulfilled, (state, action) => {
      const { playlistID, songs } = action.payload;
      const playlist = state.playlists.find((playlist) => playlist.playlistID === playlistID);
      if (playlist) {
        playlist.songs = songs;
      }
    });
  }
});

export const { login, signup } = playlistsSlice.actions;

export default playlistsSlice.reducer;