const express = require('express');
var router = express.Router();

const querystring = require('querystring');
const cors = require('cors');

const client_id = 'e44db89e494a47529355c4401180f251';
const client_secret = '4b1f65eda5464bfabb44593e87284d9f'; // important to protect this one
const redirect_uri = `${process.env.SERVER_URL}/spotify/callback`;

let access_token = null;
let refresh_token = null;
let spotify_profile = null;

router.use(cors());

router.get('/login', function (req, res) { // handle login request from the hyperlink on html page
  // request authorization - automatically redirects to callback
  const scope = 'user-read-private user-read-email user-library-read user-top-read playlist-read-collaborative';
  const redirect_url = 'https://accounts.spotify.com/authorize?' +
  querystring.stringify({
    response_type: 'code',
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
  });

  return res.send({redirect_url});
});

router.get('/callback', function (req, res) {
  // request refresh and access tokens after comparing states

  let code = req.query.code || null;

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
    },
    body: `code=${code}&redirect_uri=${redirect_uri}&grant_type=authorization_code`,
    json: true
  };

fetch('https://accounts.spotify.com/api/token', authOptions) // make request to token endpoint for our tokens
  .then((response) => {
    if (response.status === 200) {
      response.json().then((data) => {
        access_token = data.access_token
        refresh_token = data.refresh_token
        res.redirect(`http://localhost:3000/login?access_token=${access_token}&refresh_token=${refresh_token}&type=${"spotify"}&error=${"NO_ERROR"}`);
      });
    } else {
      res.redirect(`http://localhost:3000/login?&error=${"ERROR_INVALID_TOKEN"}`);;
    };
  })
  .catch(error => {
    console.error(error);
    return res.send(error);
  });
});

router.get('/refresh_token', function (req, res) {
  /*
  I included an example refresh token request since it's useful to have, but this should obviously be implemented
  in a different way than just having the user press a button on the screen - access tokens expire after
  2 hours (I believe) so you'll need to manage refreshes based on that
  */

  const refresh_token = req.query.refresh_token;
  const authOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=refresh_token&refresh_token=${refresh_token}`,
  };

  fetch('https://accounts.spotify.com/api/token', authOptions)
    .then(response => {
      if (response.status === 200) {
        response.json().then((data) => {
          access_token = data.access_token;
          return res.send({ access_token });
        });
      };
    })
    .catch(error => {
      console.error(error);
      return res.send(error);
    });
});

router.get('/profile', function (req, res) {
  if (!access_token) {
    res.status(400);
    res.send({error: "access_token not found, request it and then try again"});
  } else {
    fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` }
    }).then(response => {
      if (response.status === 200) {
        response.json().then((data) => {
          spotify_profile = data;
          res.send(spotify_profile);
        });
      }
    }).catch(error => {
      console.log(error);
      return res.send(error);
    });
  }
});

module.exports = router;
