import { createSlice } from '@reduxjs/toolkit';

// playlist is an object that contains:
// id: "",
// songs: []
const initialState = {
    playlist: {
        id: "",
        songs: []
    }
};

const playerSlice = createSlice({
    name: 'player',
    initialState: initialState,
    reducers: {
        setPlaylist: (state, action) => {
            console.log(action.payload);
            state.playlist = action.payload;
        }
    }
});

export const { setPlaylist } = playerSlice.actions;

export default playerSlice.reducer;
