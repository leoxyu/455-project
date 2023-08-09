const ROOT_URL = process.env.REACT_APP_SERVER_URL;

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

