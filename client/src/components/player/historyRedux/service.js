import { getUserId, getAccessToken, getAuthorID} from "../../../util";
const BASE_URL = 'http://localhost:3001/';

async function postListen(song) {
    const userID = getAuthorID();
    var url = BASE_URL + 'history/' + userID;
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(song),
        headers: {
            'Content-Type': 'application/json' // Set the Content-Type header
        }
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function getHistory() {
    const userID = getAuthorID();
    var url = BASE_URL + 'history/' + userID;
    const response = await fetch(url, {
        method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function getRecommendations() {
    const userID = getAuthorID();
    var url = BASE_URL + 'history/recommendations/' + userID + '?limit=100';
    const response = await fetch(url, {
        method: 'GET',
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

export default {
    postListen,
    getHistory,
    getRecommendations
};

