import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from './utils';
import {postListenAsync, getHistoryAsync, getRecommendationsAsync } from './thunks';


const INITIAL_STATE = {
    historySongs: [],
    recommendationSongs: [],
    postListen: REQUEST_STATE.IDLE,
    getHistory: REQUEST_STATE.IDLE,
    getRecommendations: REQUEST_STATE.IDLE,
    errors: null
};


const historySlice = createSlice({
    name: 'history',
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(postListenAsync.pending, (state, action) => {
            state.postListen = REQUEST_STATE.PENDING;
        });
        builder.addCase(postListenAsync.fulfilled, (state, action) => {
            state.postListen = REQUEST_STATE.FULFILLED;

        });
        builder.addCase(postListenAsync.rejected, (state, action) => {
            state.postListen = REQUEST_STATE.REJECTED;
            state.errors = action.payload;
        });
        builder.addCase(getHistoryAsync.pending, (state, action) => {
            state.getHistory = REQUEST_STATE.PENDING;
        }
        );
        builder.addCase(getHistoryAsync.fulfilled, (state, action) => {
            state.getHistory = REQUEST_STATE.FULFILLED;
            state.historySongs = action.payload;
        }
        );
        builder.addCase(getHistoryAsync.rejected, (state, action) => {
            state.getHistory = REQUEST_STATE.REJECTED;
            state.errors = action.payload;
        }
        );
        builder.addCase(getRecommendationsAsync.pending, (state, action) => {
            state.getRecommendations = REQUEST_STATE.PENDING;
        }
        );
        builder.addCase(getRecommendationsAsync.fulfilled, (state, action) => {
            state.getRecommendations = REQUEST_STATE.FULFILLED;
            state.recommendationSongs = action.payload;
        }
        );
        builder.addCase(getRecommendationsAsync.rejected, (state, action) => {
            state.getRecommendations = REQUEST_STATE.REJECTED;
            state.errors = action.payload;
        }
        );
    }
});


export default historySlice.reducer;
