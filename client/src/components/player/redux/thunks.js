import { createAsyncThunk } from '@reduxjs/toolkit';
import { actionTypes } from './actionTypes';
import UserService from './service';


export const postListenAsync = createAsyncThunk(
    actionTypes.POST_LISTEN,
    async (song) => {
        return await UserService.postListen(song);
    }
);
