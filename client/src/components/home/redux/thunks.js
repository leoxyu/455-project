import { createAsyncThunk } from "@reduxjs/toolkit";
import PlaylistsService from "./service";

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
    'createPlaylist',
    async (body) => {
        return await PlaylistsService.createPlaylist(body);
    }
)

export const deletePlaylistAsync = createAsyncThunk(
    'deletePlaylist',
    async ({ playlistID }) => {
        return await PlaylistsService.deletePlaylist(playlistID);
    }
);

export const editPlaylistAsync = createAsyncThunk(
    'editPlaylist',
    async ({ playlistID, newBody }) => {
        return await PlaylistsService.editPlaylist(playlistID, newBody);
    }
);

export const getPlaylistsAsync = createAsyncThunk(
    'getPlaylists',
    async () => {
        return await PlaylistsService.getPlaylists();
    }
);

export const addSongAsync = createAsyncThunk(
    'addSong',
    async ({ playlistID, songBody }) => {
        return await PlaylistsService.addSong(playlistID, songBody);
    }
);

export const removeSongAsync = createAsyncThunk(
    'removeSong',
    async ({ playlistID, songID }) => {
        return await PlaylistsService.removeSong(playlistID, songID);
    }
);

export const getSongsAsync = createAsyncThunk(
    'getSongs',
    async ({ playlistID }) => {
        return await PlaylistsService.getSongs(playlistID);
    }
);

