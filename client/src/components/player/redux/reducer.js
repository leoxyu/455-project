import { createSlice } from '@reduxjs/toolkit';
import { REQUEST_STATE } from './utils';
import {postListenAsync } from './thunks';


const INITIAL_STATE = {
    postListen: REQUEST_STATE.IDLE,
    errors: null
};


const searchSlice = createSlice({
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
    }
});


export default searchSlice.reducer;
