import { createSlice } from '@reduxjs/toolkit';

const currentPlaylistSlice = createSlice({
  name: 'currentPlaylistPage',
  initialState: {
    currSongID: null,
  },
  reducers: {
    setCurrSongIdPlaylistPage: (state, action) => {
      state.currSongID = action.payload;
    }
  },
});

export const { setCurrSongIdPlaylistPage } = currentPlaylistSlice.actions;

export default currentPlaylistSlice.reducer;
