var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
const { LOGIN_STATUS } = require('../login/loginConstants');
const { DATABASE_NAME, USER_COLLECTION, LOGIN_KEY } = require('../shared/mongoConstants');
const CryptoJS = require("crypto-js");
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

function encryptString(message, secretKey) {
  var encryptedMessage = CryptoJS.AES.encrypt(message, secretKey).toString();
  return encryptedMessage;
}

async function register(res, username, password) {
  await client.connect();

  const database = client.db(DATABASE_NAME);
  const collection = database.collection(USER_COLLECTION);

  const user = await collection.findOne({ user: username });
  const userExists = (user !== null);

  if (!userExists) {
    try {
      const encryptedPass = encryptString(password, LOGIN_KEY)
      const inserted = await collection.insertOne({ user: username, pass: encryptedPass });

      return res.status(200).send({
        message: 'Successfully registered account ' + username,
        id: username,
        authorID: inserted.insertedId.toString(),
        status: LOGIN_STATUS.RegisterSuccess,
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  } else {
    return res.status(400).send({
      message: 'Account ' + username + ' already exists',
      id: username,
      status: LOGIN_STATUS.RegisterFailed,
    });
  }
}

router.post('/', async function (req, res, next) {
  if (!req.body) {
    return res.status(400).send({ message: 'Missing call body!' });
  }

  const username = req.body.user;
  const password = req.body.pass;

  register(res, username, password);
});

module.exports = router;
