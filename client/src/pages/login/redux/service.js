const ROOT_URL = "http://localhost:3001"

const login = async (username, password) => {
    console.log("async login" + username + " and " + password);

    const response = await fetch(ROOT_URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            user: username,
            pass: password,
        })
    });
    return response.json();
};

const register = async (username, password) => {
    console.log("async register");

    const response = await fetch(ROOT_URL + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({
            user: username,
            pass: password,
        })
    });
    return response.json();
};

export default {
    login,
    register
}