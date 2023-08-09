import { store } from '../../../store';
import { getUserId, getAuthorID } from '../../../util';

const ROOT_URL = process.env.REACT_APP_SERVER_URL;

// TODO probably follow what was from class to be safe if we have extra time
const PlaylistsService = {
  createPlaylist: async (body) => {
    const userId = getUserId();
    const response = await fetch(`${ROOT_URL}/playlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-ID': userId,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.message;
      throw new Error(errorMsg);
    }

    return data;
  },

  deletePlaylist: async (playlistID) => {
    const userId = getUserId();
    const response = await fetch(`${ROOT_URL}/playlists/${playlistID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'User-ID': userId,
        }
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.message;
      throw new Error(errorMsg);
    }

    return playlistID;
  },
  editPlaylist: async (newBody) => {
    const userId = getUserId();
    const response = await fetch(`${ROOT_URL}/playlists/${newBody.playlistID}`, {
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
      throw new Error(errorMsg);
    }

    return data;
  },
  getPlaylists: async (isDeep) => {
    let url = `${ROOT_URL}/playlists`;
    const userId = getUserId();
    const authorID = getAuthorID();

    // TODO: Build the query string with search parameters
    const queryParams = new URLSearchParams();
    const lastId = store.getState().playlists.lastId;

    if (lastId) {
      queryParams.append('lastId', lastId);
    }

    queryParams.append("authorID", authorID);

    if (isDeep) queryParams.append('isDeep', true);

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
      throw new Error(errorMsg);
    }

    return data;
  },
  getOnePlaylist: async (playlistID) => {
    const response = await fetch(`${ROOT_URL}/playlists/${playlistID}`, {
      method: 'GET'
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg);
    }

    return data;
  },
  addSong: async (playlistID, songBody) => {
    const userId = getUserId();
    const response = await fetch(`${ROOT_URL}/playlists/${playlistID}/songs`, {
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
      throw new Error(errorMsg);
    }

    return data;
  },
  removeSong: async (playlistID, songID) => {
    const userId = getUserId();
    const response = await fetch(`${ROOT_URL}/playlists/${playlistID}/songs/${songID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'User-ID': userId,
      }
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.message;
      throw new Error(errorMsg);
    }

    return { playlistID, songID }; // need to return both playlistID and songID
  },
  getSongs: async (playlistID, searchParam) => {
    const userId = getUserId();
    let url = `${ROOT_URL}/playlists/${playlistID}`;

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
      throw new Error(errorMsg);
    }
    return data;
  },
  spotifyGetManyPlaylists: async (playlists, accessToken, authorID) => {
    const dataToSend = {
      playlists: playlists,
      accessToken: accessToken,
      authorID: authorID
    };

    const dataToSendStringify = JSON.stringify(dataToSend);

    const result = await fetch(`${ROOT_URL}/playlists/importManySpotify`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },

      body: dataToSendStringify
    });

    return await result.json();
  }
};

export default PlaylistsService;
