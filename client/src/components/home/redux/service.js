import { v1 } from 'uuid';
const ROOT_URL = "http://localhost:3001";

const PlaylistsService = {
    createPlaylist: async (body) => {
        return { id: v1(), ...body };
    },
    deletePlaylist: async (playlistID) => {  
        return playlistID;
    },
    editPlaylist: async (playlistID, newBody) => {
        return newBody;
    },
    getPlaylists: async () => {
        return [
        { id: 1, name: "Playlist 1", songs: [] },
        { id: 2, name: "Playlist 2", songs: [] },
        ];
    },
    addSong: async (playlistID, songBody) => {
        return { id: v1(), ...songBody };
    },
    removeSong: async (playlistID, songID) => {
        return songID;
    },
    getSongs: async (playlistID) => {
        return [
            { URI: 'wdfw9df9d9fw', source: 'Youtube' },
            { URI: 'dfwefd9df9f9', source: 'Youtube' },
        ];
    },
};
  
export default PlaylistsService;