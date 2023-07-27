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

