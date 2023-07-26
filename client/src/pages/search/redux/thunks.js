import { createAsyncThunk } from '@reduxjs/toolkit';
import { actionTypes } from './actionTypes';
import UserService from './service';


export const getSpotifyAsync = createAsyncThunk(
    actionTypes.GET_SPOTIFY,
    async ({accessToken, query, type}) => {
        return await UserService.getSpotify(accessToken, query, type);
    }
);


export const getNextSpotifyAsync = createAsyncThunk(
    actionTypes.GET_NEXT_SPOTIFY_TRACKS,
    async ({accessToken, cookieId, type}) => {
        return await UserService.getSpotifyNext(accessToken, cookieId, type);
    }
);


export const getYoutubeAsync = createAsyncThunk(
    actionTypes.GET_YOUTUBE,
    async ({query, type}) => {
        return await UserService.getYoutube(query, type);
    }
);


export const getNextYoutubeAsync = createAsyncThunk(
    actionTypes.GET_NEXT_YOUTUBE,
    async ({cookieId, type}) => {
        return await UserService.getYoutubeNext(cookieId, type);
    }
);

export const getYoutubePlaylistAsync = createAsyncThunk(
    actionTypes.GET_PLAYLIST_YOUTUBE,
    async ({playlistId}) => {
        return await UserService.getYoutubePlaylist(playlistId);
    }
);