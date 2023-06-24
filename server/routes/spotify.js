const express = require('express');
var router = express.Router();

const querystring = require('querystring');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const client_id = 'e44db89e494a47529355c4401180f251';
const client_secret = '4b1f65eda5464bfabb44593e87284d9f'; // important to protect this one
const redirect_uri = 'http://localhost:3001/spotify/callback';

const generateRandomString = function (length) { // generate random string to use as a state
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

let stateKey = 'spotify_auth_state'; // name of the cookie

let app = express();

// app.use(express.static(__dirname + '/public'))
router.use(cors())
      .use(cookieParser());

router.get('/login', function (req, res) { // handle login request from the hyperlink on html page
    console.log("In spotify login");

  let state = generateRandomString(16);
  res.cookie(stateKey, state); // set cookie to travel with request

  // request authorization - automatically redirects to callback
  const scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state
      }));
});

router.get('/callback', function (req, res) {

  // request refresh and access tokens after comparing states

  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
      res.redirect('/#' +
          querystring.stringify({
              error: 'state_mismatch'
          }));
  } else {
      res.clearCookie(stateKey); // eat (clear) cookie

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
                      let access_token = data.access_token
                      let refresh_token = data.refresh_token
                      res.redirect('/#' +
                          querystring.stringify({
                              access_token: access_token,
                              refresh_token: refresh_token
                          }));
                  });
              } else {
                  res.redirect('/#' +
                      querystring.stringify({
                          error: 'invalid_token'
                      }));
              };
          })
          .catch(error => {
              console.error(error);
          });
  }
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
                  const access_token = data.access_token;
                  res.send({ access_token });
              });
          };
      })
      .catch(error => {
          console.error(error);
          res.send(error);
      });
});

module.exports = router;