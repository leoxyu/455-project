var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    if (!req.body) {
        return res.status(400).send({ message: 'Missing call body!' })
    }

    console.log(req.body.user);
    console.log(req.body.pass);
});

module.exports = router;

