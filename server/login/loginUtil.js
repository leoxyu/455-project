const { LOGINS } = require('./loginValues');

const LOGIN_STATUS = {
    LogInSuccess: "logInSuccess",
    LogInFailed: "logInFailed",
    TryRegister: "tryRegister",
    RegisterSuccess: "registerSuccess",
    RegisterFailed: "registerFailed",
    UnknownStatus: "unknownStatus"
}

function authenticateLogin(user, pass) {
    const foundUser = LOGINS.find((obj) => obj.user === user);
    if (foundUser) {
        if (foundUser.pass === pass) {
            return LOGIN_STATUS.LogInSuccess;
        } else {
            return LOGIN_STATUS.LogInFailed;
        }
    } else {
        return LOGIN_STATUS.TryRegister;
    }
};

module.exports = {
    authenticateLogin,
    LOGIN_STATUS
};