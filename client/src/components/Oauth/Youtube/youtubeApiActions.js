import { getAuthorID } from "../../../util";

const ROOT_URL = process.env.REACT_APP_SERVER_URL;

export async function youtubeLogin() {
  const result = await fetch(`${ROOT_URL}/youtube/login`, {
    method: "GET"
  });

  return await result.json();
}

export async function youtubeGetPlaylists(access_token) {
  let url = `${ROOT_URL}/youtube/playlists`;
  const authorID = getAuthorID();

  console.log(authorID);
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

