const { LOGINS } = require('./loginValues');

function authenticateLogin(user, pass) {
    const foundUser = LOGINS.find((obj) => obj.user === user);
    if (foundUser) {
        if (foundUser.pass === pass) {
            console.log("Login successful!");
        } else {
            console.log("Incorrect password!");
        }
    } else {
        console.log("User not found!");
    }
};

module.exports = {
    authenticateLogin
};