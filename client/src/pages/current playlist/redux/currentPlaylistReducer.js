import { createSlice } from '@reduxjs/toolkit';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../redux/typeConstants.js");

const currentPlaylistSlice = createSlice({
    name: 'currentPlaylist',
    initialState: {

        playlist: {

            playlistId: 1,
            playlistLink: "https://open.spotify.com/album/2VFEPv8gs1mSj67hEDbRMO",
            playlistObjectId: null,
            playlistName: "EYES",
            playlistType: TYPE_ALBUM,
            author: "MYTH & ROID",
            authorCoverUrl: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.nautiljon.com%2Fimages%2Fpeople%2F00%2F99%2Fmyth_roid_62399.jpg%3F1475910665&f=1&nofb=1&ipt=bba15313032611143b9dab6e2e24285649baeb01421f46cecabe93b9357f3719&ipo=images",
            authorUserId: null,
            releaseDate: "2016-07-25",
            type: TYPE_SPOTIFY,
            coverUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.littleoslo.com%2Flyj%2Fhome%2Fwp-content%2Fuploads%2F2017%2F04%2FMYTH-ROID.jpg&f=1&nofb=1&ipt=bdd56da2ea9ef64dc79e9d19789e52fb00bca6460f6028bba28605dd57e0bbcf&ipo=images",
            numTracks: 3,
            totalDuration: 269 + 286 + 275,
            isFavorite: true,
            tracks: [
                {
                    trackId: 1,
                    trackObjectId: null,
                    trackName: "STYX HELIX",
                    artist: "MYTH & ROID",
                    duration: 286,
                    album: "EYE'S",
                    isFavorite: true,
                    type: TYPE_SPOTIFY,
                    link: "https://open.spotify.com/track/2tcSz3bcJqriPg9vetvJLs",
                    coverUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.littleoslo.com%2Flyj%2Fhome%2Fwp-content%2Fuploads%2F2017%2F04%2FMYTH-ROID.jpg&f=1&nofb=1&ipt=bdd56da2ea9ef64dc79e9d19789e52fb00bca6460f6028bba28605dd57e0bbcf&ipo=images",
                    releaseDate: "2016-07-25",
                    popularity: 0.9,
                },
                {
                    trackId: 2,
                    trackObjectId: null,
                    trackName: "ANGER/ANGER",
                    artist: "MYTH & ROID",
                    duration: 269,
                    album: "EYE'S",
                    isFavorite: false,
                    type: TYPE_SPOTIFY,
                    link: "https://open.spotify.com/track/7DQygUzU3ah8qyOY5Y0XsN",
                    coverUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.littleoslo.com%2Flyj%2Fhome%2Fwp-content%2Fuploads%2F2017%2F04%2FMYTH-ROID.jpg&f=1&nofb=1&ipt=bdd56da2ea9ef64dc79e9d19789e52fb00bca6460f6028bba28605dd57e0bbcf&ipo=images",
                    releaseDate: "2016-07-25",
                    popularity: 0.5,
                },
                {
                    trackId: 3,
                    trackObjectId: null,
                    trackName: "-to the future days",
                    artist: "MYTH & ROID",
                    duration: 275,
                    album: "EYE'S",
                    isFavorite: false,
                    type: TYPE_SPOTIFY,
                    link: "https://open.spotify.com/track/1BoO5Pgzw9Ae6IJY6ddZDO",
                    coverUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.littleoslo.com%2Flyj%2Fhome%2Fwp-content%2Fuploads%2F2017%2F04%2FMYTH-ROID.jpg&f=1&nofb=1&ipt=bdd56da2ea9ef64dc79e9d19789e52fb00bca6460f6028bba28605dd57e0bbcf&ipo=images",
                    releaseDate: "2016-07-25",
                    popularity: 0.3,
                },

            ]
        },

        currentTrack: null
    },
    reducers: {
        loadNewPlaylist: (state, action) => {
        },
    },
    extraReducers: (builder) => {

    }
});

export const { } = currentPlaylistSlice.actions;

export default currentPlaylistSlice.reducer;