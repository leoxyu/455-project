import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  startFromTop: true,
  playlist: {
    id: "",
    playlistName: "",
    thumbnailUrl: "",
    releaseDate: "",
    duration: 0,
    artistName: "",
    isFavorited: false,
    source: "",
    type: "",
    description: "",
    songs: []
  },
  currSongID: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState: initialState,
  reducers: {
    setPlaylist: (state, action) => {
      const { playlist, startFromTop } = action.payload;
      console.log(action.payload);
      state.playlist = playlist;
      state.startFromTop = startFromTop;
    },
    setCurrSongID: (state, action) => {
      console.log("\r\nChanging currSongID in playerReducer");
      console.log("\r\nSetting new currSong to: ");
      console.log(action.payload);
      state.currSongID = action.payload;
    }
  }
});

export const { setPlaylist, setCurrSongID } = playerSlice.actions;

export default playerSlice.reducer;
