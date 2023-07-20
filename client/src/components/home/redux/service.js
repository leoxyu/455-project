import { getUserId } from '../../../util';
const ROOT_URL = "http://localhost:3001";

// TODO probably follow what was from class to be safe if we have extra time
const PlaylistsService = {
    createPlaylist: async (body) => {
        const userId = getUserId();
        const response = await fetch('http://localhost:3001/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-ID': userId,
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data?.message;
            throw new Error(errorMsg)
        }
        return data;

        // return { id: v1(), ...body };
    },
    deletePlaylist: async (playlistID) => {
        const userId = getUserId();
        const response = await fetch(`http://localhost:3001/playlists/${playlistID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'User-ID': userId,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data?.message;
            throw new Error(errorMsg)
        }
        return playlistID;
        // return playlistID;
    },
    editPlaylist: async (newBody) => {
        const userId = getUserId();
        const response = await fetch(`http://localhost:3001/playlists/${newBody.playlistID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'User-ID': userId,
            },
            body: JSON.stringify(newBody)
        });

        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data?.message;
            throw new Error(errorMsg)
        }
        return data;
    },
    getPlaylists: async (searchParam) => {
        let url = 'http://localhost:3001/playlists';
        const userId = getUserId();
        // Build the query string with search parameters
        const queryParams = new URLSearchParams();
        if (searchParam) {
            queryParams.append('name', searchParam);
        }

        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-ID': userId,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data?.message;
            throw new Error(errorMsg)
        }
        return data;
    },
    addSong: async (playlistID, songBody) => {
        const userId = getUserId();
        const response = await fetch(`http://localhost:3001/playlists/${playlistID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-ID': userId,
            },
            body: JSON.stringify(songBody)
        });
        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data?.message;
            throw new Error(errorMsg)
        }
        return data;
        // return { id: v1(), ...songBody };
    },
    removeSong: async (playlistID, songID) => {
        const userId = getUserId();
        const response = await fetch(`http://localhost:3001/playlists/${playlistID}/${songID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'User-ID': userId,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data?.message;
            throw new Error(errorMsg)
        }
        return { playlistID, songID }; // need to return both playlistID and songID
        // return songID;
    },
    getSongs: async (playlistID, searchParam) => {
        let url = `http://localhost:3001/playlists/${playlistID}`;
        const userId = getUserId();
        // Build the query string with search parameters
        const queryParams = new URLSearchParams();
        if (searchParam) {
            queryParams.append('name', searchParam);
        }

        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-ID': userId,
            }
        });
        const data = await response.json();
        if (!response.ok) {
            const errorMsg = data?.message;
            throw new Error(errorMsg)
        }
        return data;
        // return [
        //     { URI: 'wdfw9df9d9fw', source: 'Youtube' },
        //     { URI: 'dfwefd9df9f9', source: 'Youtube' },
        // ];
    },
};

export default PlaylistsService;