const ROOT_URL = 'https://uni-fi.onrender.com';

export async function youtubeLogin() {
    const result = await fetch(`${ROOT_URL}/youtube/login`, {
      method: "GET"
    });

    return await result.json();
  }