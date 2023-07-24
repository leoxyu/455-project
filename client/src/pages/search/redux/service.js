
const BASE_URL = 'http://localhost:3001/';
async function getSpotify(accessToken, query, type) {
    var url = BASE_URL + 'sp-search';
    // Build the query string with search parameters
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('accessToken', accessToken);
    if (type) {
        queryParams.append('type', type);
    }
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
        method: 'GET'
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function getSpotifyNext(accessToken, cookieId, type) {
    let url = BASE_URL + 'sp-search/next';
    const queryParams = new URLSearchParams();
    queryParams.append('cookieId', cookieId);
    queryParams.append('accessToken', accessToken);
    queryParams.append('type', type);

    
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
        method: 'GET'

    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}



async function getYoutube(query, type) {
    let url = BASE_URL + 'yt-search';
    // Build the query string with search parameters
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    if (type) {
        queryParams.append('type', type);
    }
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
        method: 'GET'
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function getYoutubeNext(cookieId, type) {
    let url = BASE_URL + 'yt-search/next';
    const queryParams = new URLSearchParams();
    queryParams.append('cookieId', cookieId);
    queryParams.append('type', type);


    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
        method: 'GET'
    });

    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}




export default {
    getSpotify,
    getSpotifyNext,
    getYoutube,
    getYoutubeNext
};

