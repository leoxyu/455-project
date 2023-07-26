

export async function youtubeLogin() {
    const result = await fetch("http://localhost:3001/youtube/login", {
      method: "GET"
    });
  
    return await result.json();
  }