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
    playlists: [
        // {
        //     playlistID: '1',
        //     name: 'Playlist 1',
        //     dateCreated: '2023-06-09',
        //     description: 'bla bla',
        //     author: 'Ning Leng',
        //     isFavorited: false,
        //     coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',
        //     songs: [
        //         {
        //             source: 'Spotify',
        //             URI: '0upq5GkOZ25DoExIOyWHkE'
        //         },
        //         {
        //             source: 'Spotify',
        //             URI: '2k76aPyqAiGhTm68fjB2u8'
        //         },
        //         {
        //             source: 'Youtube',
        //             URI: 'DLzxrzFCyOs'
        //         }
        //     ]
        // },
        // {
        //   playlistID: '2',
        //   name: 'Playlist 2',
        //   dateCreated: '2023-06-09',
        //   description: 'bla bla',
        //   author: 'Ning Ning',
        //   isFavorited: false,
        //   coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',
        //   songs: [
        //       {
        //           source: 'Spotify',
        //           URI: '0upq5GkOZ25DoExIOyWHkE'
        //       },
        //       {
        //           source: 'Spotify',
        //           URI: '2k76aPyqAiGhTm68fjB2u8'
        //       },
        //       {
        //           source: 'Youtube',
        //           URI: 'DLzxrzFCyOs'
        //       }
        //   ]
        // },
        // { playlistID: '2', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
        // { playlistID: '3', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
        // { playlistID: '4', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
        // { playlistID: '5', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
        // { playlistID: '6', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
        // { playlistID: '7', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
    
    ]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(createPlaylistAsync.fulfilled, (state, action) => {
      state.playlists.push(action.payload);
    })
    builder.addCase(deletePlaylistAsync.fulfilled, (state, action) => {
      state.playlists = state.playlists.filter((i) => i.playlistID !== action.payload);
    })
    builder.addCase(editPlaylistAsync.fulfilled, (state, action) => {
      // Find the edited playlist in the state and update its properties
      const playlistIndex = state.playlists.findIndex((playlist) => playlist.id === action.payload);
      if (playlistIndex !== -1) {
        state.playlists[playlistIndex] = { ...state.playlists[playlistIndex], ...action.payload };
      }
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