import { createAsyncThunk } from '@reduxjs/toolkit';
import { actionTypes } from './actionTypes';
import UserService from './service';


export const getSpotifyAsync = createAsyncThunk(
    actionTypes.GET_SPOTIFY,
    async ({accessToken, query, types=['track', 'album', 'playlist']}) => {
        console.log('getSpotifyAsync query' + query);
        return await UserService.getSpotify(accessToken, query, types);
    }
);