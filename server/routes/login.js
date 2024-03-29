var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
const { LOGIN_STATUS } = require('../login/loginConstants');
const { DATABASE_NAME, USER_COLLECTION, LOGIN_KEY } = require('../shared/mongoConstants');
const CryptoJS = require("crypto-js");
require('dotenv').config();

function decryptString(encryptedMessage, secretKey) {
  var decryptedBytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
  var decryptedMessage = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
}

const client = new MongoClient(process.env.MONGO_URI);

async function authenticateLogin(username, password) {
  let status = LOGIN_STATUS.UnknownStatus;
  let id;

  await client.connect();

  const database = client.db(DATABASE_NAME);
  const collection = database.collection(USER_COLLECTION);

  const foundUser = await collection.findOne({ user: username });

  if (foundUser) {
    id = foundUser._id.toString();
    if (decryptString(foundUser.pass, LOGIN_KEY) === password) {
      status = LOGIN_STATUS.LogInSuccess;
    } else {
      status = LOGIN_STATUS.LogInFailed;
    }
  } else {
    status = LOGIN_STATUS.TryRegister;
  }

  return {
    status: status,
    id: id
  };
}

router.post('/', function (req, res, next) {
  if (!req.body) {
    return res.status(400).send({ message: 'Missing call body!' })
  }

  const username = req.body.user;
  const password = req.body.pass;

  authenticateLogin(username, password)
    .then((result) => {
      switch (result.status) {
        case LOGIN_STATUS.LogInSuccess:
          return res.status(200).send({
            message: 'Successfully signed into account ' + username,
            id: username,
            authorID: result.id,
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
    })
    .catch((error) => {
      return res.status(500).send({
        message: 'Error occurred while authenticating credentials.',
        error: error.message
      });
    });
});

module.exports = router;
