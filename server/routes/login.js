var express = require('express');
var router = express.Router();
const { authenticateLogin } = require('../login/loginUtil');

router.post('/', function (req, res, next) {
    if (!req.body) {
        return res.status(400).send({ message: 'Missing call body!' })
    }

    const username = req.body.user;
    const password = req.body.pass;

    authenticateLogin(username, password);

});

module.exports = router;
