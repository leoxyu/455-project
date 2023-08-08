import { getAuthorID } from "../../../util";
const BASE_URL = 'http://localhost:3001/';
async function getSpotify(accessToken, query, type) {
    var url = BASE_URL + 'sp-search';
    // Build the query string with search parameters
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    // queryParams.append('accessToken', accessToken);
    if (type) {
        queryParams.append('type', type);
    }
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function getSpotifyNext(accessToken, nextEndpoint) {
    let url = BASE_URL + 'sp-search?' + nextEndpoint;
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}



async function getYoutube(query, type, userID) {
    let url = BASE_URL + 'yt-search';
    // Build the query string with search parameters
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    if (type) {
        queryParams.append('type', type);
    }
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const headers = new Headers();
    headers.append('userid', userID);
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function getYoutubeNext(nextEndpoint, userID) {
    const url = BASE_URL + `yt-search?${nextEndpoint}`
    const headers = new Headers();
    headers.append('userid', userID);

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function getYoutubePlaylistByID(id, pushToDatabase = false) {
    const authorID = getAuthorID();
    let url = BASE_URL + `yt-search/playlists/${id}`;


    // TODO if redux store search result has songs populated, then push straigh to DB if true, else do nothing
    const headers = new Headers();
    if (pushToDatabase) {
        headers.append('authorid', authorID);
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}



async function getSpotifyCollectionByID(access_token, id, type) {
    const url = BASE_URL + `sp-search/${type}/${id}/tracks`;

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${access_token}`);

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}


async function getSpotifyNextCollectionByID(access_token, nextEndpoint) {
    const url = BASE_URL + `sp-search/${nextEndpoint}`;
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${access_token}`);

    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    });

    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function setSearchTermAsync(searchTerm) {
    return searchTerm;
}


export default {
    getSpotify,
    getSpotifyNext,
    getSpotifyCollectionByID,
    getSpotifyNextCollectionByID,
    getYoutube,
    getYoutubeNext,
    getYoutubePlaylistByID,
    setSearchTermAsync
};

