import { createAsyncThunk } from "@reduxjs/toolkit";
import PlaylistsService from "./service";
import { actionTypes } from "./actionTypes";

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

export const createPlaylistAsync = createAsyncThunk(
  actionTypes.CREATE_PLAYLIST,
  async (body) => {
    return await PlaylistsService.createPlaylist(body);
  }
)

export const deletePlaylistAsync = createAsyncThunk(
  actionTypes.DELETE_PLAYLIST,
  async (playlistID) => {
    return await PlaylistsService.deletePlaylist(playlistID);
  }
);

export const editPlaylistAsync = createAsyncThunk(
  actionTypes.EDIT_PLAYLIST,
  async (playlistID, newBody) => {
    return await PlaylistsService.editPlaylist(playlistID, newBody);
  }
);

export const getPlaylistsAsync = createAsyncThunk(
  actionTypes.GET_PLAYLISTS,
  async ({ isDeep = false }) => {
    return await PlaylistsService.getPlaylists(isDeep);
  }
);

export const getOnePlaylist = createAsyncThunk(
  actionTypes.GET_ONE_PLAYLIST,
  async (playlistID) => {
    return await PlaylistsService.getOnePlaylist(playlistID);
  }
);

export const addSongAsync = createAsyncThunk(
  actionTypes.ADD_SONG,
  async ({playlistID, songBody}) => { // BRUH this is annoying (needs to be in an object, not separate params)
    return await PlaylistsService.addSong(playlistID, songBody);
  }
);

export const removeSongAsync = createAsyncThunk(
  actionTypes.REMOVE_SONG,
  async ({ playlistID, songID }) => {
    return await PlaylistsService.removeSong(playlistID, songID);
  }
);

export const getSongsAsync = createAsyncThunk(
  actionTypes.GET_SONGS,
  async ({ playlistID }) => {
    return await PlaylistsService.getSongs(playlistID);
  }
);

export const spotifyGetManyPlaylistsThunk = createAsyncThunk(
  actionTypes.SPOTIFY_GET_PLAYLISTS,
  async ({playlists, accessToken, authorID}) => {
    return await PlaylistsService.spotifyGetManyPlaylists(playlists, accessToken, authorID);
  }
);
