import { createSlice } from '@reduxjs/toolkit';
import { createPlaylistAsync, 
  deletePlaylistAsync, 
  editPlaylistAsync, 
  addSongAsync, 
  getPlaylistsAsync, 
  removeSongAsync, 
  getSongsAsync } from './thunks';

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
    playlists: []
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
      const idx = state.playlists.findIndex((playlist) => playlist.playlistID === action.payload.id);
      state.playlists[idx] = action.payload;
    });
    builder.addCase(getPlaylistsAsync.fulfilled, (state, action) => {
      state.playlists = action.payload;
    });
    builder.addCase(addSongAsync.fulfilled, (state, action) => {
      const { playlistID, songBody } = action.payload;
      const playlist = state.playlists.find((playlist) => playlist.id === playlistID);
      if (playlist) {
        playlist.songs.push(songBody);
      }
    });
    builder.addCase(removeSongAsync.fulfilled, (state, action) => {
      const { playlistID, songID } = action.payload;
      const playlist = state.playlists.find((playlist) => playlist.id === playlistID);
      if (playlist) {
        playlist.songs = playlist.songs.filter((song) => song !== songID);
      }
    });
    builder.addCase(getSongsAsync.fulfilled, (state, action) => {
      const { playlistID, songs } = action.payload;
      const playlist = state.playlists.find((playlist) => playlist.id === playlistID);
      if (playlist) {
        playlist.songs = songs;
      }
    });
  }
});

export const { login, signup } = playlistsSlice.actions;

export default playlistsSlice.reducer;