const ROOT_URL = 'http://localhost:3001';

export async function youtubeLogin() {
    const result = await fetch(`${ROOT_URL}/youtube/login`, {
      method: "GET"
    });
  
    return await result.json();
  }