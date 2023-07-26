

export async function spotifyLogin() {
  const result = await fetch("http://localhost:3001/spotify/login", {
    method: "GET"
  });

  return await result.json();
}

export async function spotifyGetProfile() {
  const result = await fetch("http://localhost:3001/spotify/profile", {
    method: "GET"
  });

  return await result.json();
}

