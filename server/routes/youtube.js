const express = require('express');
var router = express.Router();

const querystring = require('querystring');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const client_id = '27604080756-2btdk60i5tahi5i4687pokqj56bavkcb.apps.googleusercontent.com';
const client_secret = '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'; // important to protect this one
const callback_uri = 'https://uni-fi-9b54.onrender.com/login';

let access_token = null;
let refresh_token = null;
let youtube_profile = null;

router.use(cors());

router.get('/login', function (req, res) { // handle login request from the hyperlink on html page
    console.log("In youtube login");

  // request authorization - automatically redirects to callback
  const scope = 'https://www.googleapis.com/auth/youtube.readonly';
  const redirect_url = 'https://accounts.google.com/o/oauth2/v2/auth?' +
  querystring.stringify({
      response_type: 'token',
      client_id: client_id,
      scope: scope,
      redirect_uri: callback_uri,
      include_granted_scopes: 'true',
      state: 'yeet'
  });

  return res.send({redirect_url});
});



module.exports = router;