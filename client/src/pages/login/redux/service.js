const ROOT_URL = "https://uni-fi.onrender.com"

const login = async (username, password) => {
    const response = await fetch(ROOT_URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: username.toLowerCase(),
            pass: password,
        })
    });
    return response.json();
};

const register = async (username, password) => {
    const response = await fetch(ROOT_URL + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: username.toLowerCase(),
            pass: password,
        })
    });
    return response.json();
};

export default {
    login,
    register
}