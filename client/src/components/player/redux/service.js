import { getUserId, getAccessToken} from "../../../util";
const BASE_URL = 'http://localhost:3001/';

async function postListen(song) {
    const userID = getUserId();
    var url = BASE_URL + 'history/' + userID;

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${getAccessToken()}`);
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ song: song }),
        headers: headers
    });
    const data = await response.json();
    if (!response.ok) {
        const errorMsg = data?.message;
        throw new Error(errorMsg)
    }
    return data;
}

async function getHistory() {
    const userID = getUserId();
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
    const userID = getUserId();
    var url = BASE_URL + 'recommendations/' + userID;
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

