const ROOT_URL = 'http://localhost:3001';

export async function spotifyLogin() {
  const result = await fetch(`${ROOT_URL}/spotify/login`, {
    method: "GET"
  });

  return await result.json();
}

export async function spotifyGetProfile() {
  const result = await fetch(`${ROOT_URL}/spotify/profile`, {
    method: "GET"
  });

  return await result.json();
}

export async function spotifyGetManyPlaylists(playlists, accessToken) {

  const result = await fetch(`${ROOT_URL}/spotify/importManySpotify`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },

    // playlists are of the following format:
    /**
     * [
     * 
     * {
     * 
     * id: string (SPOTIFY ID),
     * type: string (TYPE_PLAYLIST, TYPE_ALBUM)
     * },
     * 
     * ...
     * 
     * ]
     * 
     */

    body: {
      playlists,
      accessToken
    }
  });

  return await result.json();
}

