import { getAuthorID } from "../../../util";

const ROOT_URL = 'http://localhost:3001';

export async function youtubeLogin() {
  const result = await fetch(`${ROOT_URL}/youtube/login`, {
    method: "GET"
  });

  return await result.json();
}

export async function youtubeGetPlaylists(access_token) {
  let url = `${ROOT_URL}/youtube/playlists`;
  const authorID = getAuthorID();

  const queryParams = new URLSearchParams();
  queryParams.append("authorID", authorID);

  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const result = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return await result.json();
}
