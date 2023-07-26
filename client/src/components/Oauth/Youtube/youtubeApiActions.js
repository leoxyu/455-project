

export async function youtubeLogin() {
  const result = await fetch("http://localhost:3001/youtube/login", {
    method: "GET"
  });

  return await result.json();
}

export async function youtubeGetPlaylists(access_token) {
  console.log('calling thunk')
  const result = await fetch("http://localhost:3001/youtube/playlists", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },

  });

  return await result.json();
}

