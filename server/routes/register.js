var express = require('express');
var router = express.Router();
const { LOGINS } = require('../login/loginValues');
const { LOGIN_STATUS } = require('../login/loginUtil');

router.post('/', function (req, res, next) {
    if (!req.body) {
        return res.status(400).send({ message: 'Missing call body!' })
    }

    const username = req.body.user;
    const password = req.body.pass;


    if (!doesUserExist(username)) {
        LOGINS.push(
            {
                user: username,
                pass: password
            }
        );
    } else {
        return res.status(400).send({
            message: 'Account ' + username + ' already exists',
            id: username,
            status: LOGIN_STATUS.RegisterFailed
        });
    }

    return res.status(200).send({
        message: 'Successfully registered account ' + username,
        id: username,
        status: LOGIN_STATUS.RegisterSuccess
    });
});

module.exports = router;

function doesUserExist(username) {
    return LOGINS.some(user => user.user === username);
}