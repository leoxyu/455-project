import { createSlice } from '@reduxjs/toolkit';

const currentPlaylistSlice = createSlice({
  name: 'currentPlaylistPage',
  initialState: {
    currSongID: null,
  },
  reducers: {
    setCurrSongIdPlaylistPage: (state, action) => {
      console.log("\r\nChanging currSongID in currentPlaylistReducer");
      console.log("\r\nSetting new currSong to: ");
      console.log(action.payload);
      state.currSongID = action.payload;
    }
  },
});

export const { setCurrSongIdPlaylistPage } = currentPlaylistSlice.actions;

export default currentPlaylistSlice.reducer;
