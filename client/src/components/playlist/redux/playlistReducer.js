import { createSlice } from '@reduxjs/toolkit'



// example initial state
const initialState = [
    {
        playlistID: 1004,
        name: 'songs',
        artist: 'User',
        date: '2023-06-09',
        length: 812,
        albumCover: "(some-image-URL)",
        isFavorited: false,
        songs: [
            4415,
            1151
        ]
    },
    {
        playlistID: 1005,
        name: 'more songs',
        artist: 'User',
        date: '2023-06-04',
        length: 350,
        albumCover: "(some-image-URL)",
        isFavorited: false,
        songs: [
            1000,
            2165
        ]
    }
]

const playlistSlice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {

        createSong(state, action) {
            // TODO: creating song stuff...
        },

        toggleFavorite(state, action) {
            // TODO
        }

    }
});

export const { createSong, toggleFavorite } = songSlice.actions;
export default songSlice.reducer;