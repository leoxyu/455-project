var express = require('express');
var router = express.Router();
const { authenticateLogin, LOGIN_STATUS } = require('../login/loginUtil');

router.post('/', function (req, res, next) {
    if (!req.body) {
        return res.status(400).send({ message: 'Missing call body!' })
    }

    const username = req.body.user;
    const password = req.body.pass;

    let status = authenticateLogin(username, password);

    switch (status) {
        case LOGIN_STATUS.LogInSuccess:
            return res.status(200).send({
                message: 'Successfully signed into account ' + username,
                id: username,
                status: LOGIN_STATUS.LogInSuccess
            });
        case LOGIN_STATUS.LogInFailed:
            return res.status(400).send({
                message: 'Login failed',
                status: LOGIN_STATUS.LogInFailed
            });
        case LOGIN_STATUS.TryRegister:
            return res.status(300).send({
                message: 'User not found. Redirecting to register prompt.',
                status: LOGIN_STATUS.TryRegister
            });
        default:
          return res.status(400).send({
            message: 'Unknown status when trying to authenticate credentials.',
        });
      }

});

module.exports = router;
