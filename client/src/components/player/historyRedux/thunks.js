import { createAsyncThunk } from '@reduxjs/toolkit';
import { actionTypes } from './actionTypes';
import UserService from './service';


export const postListenAsync = createAsyncThunk(
    actionTypes.POST_LISTEN,
    async (song) => {
        return await UserService.postListen(song);
    }
);

export const getHistoryAsync = createAsyncThunk(
    actionTypes.GET_HISTORY,
    async () => {
        return await UserService.getHistory();
    }
);

export const getRecommendationsAsync = createAsyncThunk(
    actionTypes.GET_RECOMMENDATIONS,
    async () => {
        return await UserService.getRecommendations();
    }
);
