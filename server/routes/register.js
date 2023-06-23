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

    LOGINS.push(
        {
            user: username,
            pass: password
        }
    );

    return res.status(200).send({
        message: 'Successfully signed into account ' + username,
        id: username,
        status: LOGIN_STATUS.LogInSuccess
    });
});

module.exports = router;

