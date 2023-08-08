import { createAsyncThunk } from '@reduxjs/toolkit';
import { actionTypes } from './actionTypes';
import UserService from './service';


export const getSpotifyAsync = createAsyncThunk(
    actionTypes.GET_SPOTIFY,
    async ({ accessToken, query, type }) => {
        return await UserService.getSpotify(accessToken, query, type);
    }
);


export const getNextSpotifyAsync = createAsyncThunk(
    actionTypes.GET_NEXT_SPOTIFY,
    async ({ accessToken, nextEndpoint }) => {
        if (!nextEndpoint) return Promise.resolve({});
        return await UserService.getSpotifyNext(accessToken, nextEndpoint);
    }
);

export const getSpotifyPlaylistByIDAsync = createAsyncThunk(
    actionTypes.GET_SPOTIFY_PLAYLIST_BY_ID,
    async ({accessToken, id}) => {
        return await UserService.getSpotifyCollectionByID(accessToken, id, 'playlists');
    }
);

export const getSpotifyAlbumByIDAsync = createAsyncThunk(
    actionTypes.GET_SPOTIFY_ALBUM_BY_ID,
    async ({accessToken, id}) => {
        return await UserService.getSpotifyCollectionByID(accessToken, id, 'albums');
    }
);

export const getSpotifyNextCollectionByIDAsync = createAsyncThunk(
    actionTypes.GET_NEXT_SPOTIFY_COLLECTION_BY_ID,
    async ({accessToken, nextEndpoint}) => {
        return await UserService.getSpotifyNextCollectionByID(accessToken, nextEndpoint);
    }
);


export const getYoutubeAsync = createAsyncThunk(
    actionTypes.GET_YOUTUBE,
    async ({ query, type, userID}) => {
        return await UserService.getYoutube(query, type, userID);
    }
);


export const getNextYoutubeAsync = createAsyncThunk(
    actionTypes.GET_NEXT_YOUTUBE,
    async ({ nextEndpoint, userID}) => {
        if (!nextEndpoint) return Promise.resolve({});
        return await UserService.getYoutubeNext(nextEndpoint, userID);
    }
);

export const importYoutubePlaylistByIDAsync = createAsyncThunk(
    actionTypes.IMPORT_YOUTUBE_PLAYLIST_BY_ID,
    async (id) => {
        return await UserService.getYoutubePlaylistByID(id, true);
    }
);

export const getYoutubePlaylistByIDAsync = createAsyncThunk(
    actionTypes.GET_YOUTUBE_PLAYLIST_BY_ID,
    async (id) => {
        return await UserService.getYoutubePlaylistByID(id, false);
    }
);


export const setSearchTermAsync = createAsyncThunk(
    actionTypes.SET_SEARCH_TERM,
    async (searchTerm) => {
        return await UserService.setSearchTermAsync(searchTerm);
    }
);