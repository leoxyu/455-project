import { TYPE_ALBUM, TYPE_PLAYLIST, TYPE_TRACK, TYPE_SPOTIFY, TYPE_YOUTUBE } from '../shared/playlistTypeConstants';

const express = require('express');
var router = express.Router();

const querystring = require('querystring');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const client_id = 'e44db89e494a47529355c4401180f251';
const client_secret = '4b1f65eda5464bfabb44593e87284d9f'; // important to protect this one
const redirect_uri = 'http://localhost:3001/spotify/callback';

let access_token = null;
let refresh_token = null;
let spotify_profile = null;



router.use(cors());

router.get('/login', function (req, res) { // handle login request from the hyperlink on html page
    console.log("In spotify login");

    // let state = generateRandomString(16);
    // res.cookie(stateKey, state); // set cookie to travel with request

    // console.log("\nstate before sending query: ", state);

    // request authorization - automatically redirects to callback
    const scope = 'user-read-private user-read-email user-library-read user-top-read playlist-read-collaborative';
    const redirect_url = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
        });

    //   console.log("\ncookies: ", res.cookies[stateKey]);

    return res.send({ redirect_url });
});

router.get('/callback', function (req, res) {

    // request refresh and access tokens after comparing states

    let code = req.query.code || null;
    let state = req.query.state || null;

    // console.log("\ncode: ", code);
    // console.log("\nstate: ", state);

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
                    console.log("token successfully retrieved");
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
        res.send({ error: "access_token not found, request it and then try again" });
    } else {
        fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: { Authorization: `Bearer ${access_token}` }
        }).then(response => {
            if (response.status === 200) {
                response.json().then((data) => {
                    console.log("Profile successfully retrieved");
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

// fetches all tracks for a single playlist

function getTracksHelper(access_token, next, playlist) {
    // if next link is null, dont do anything
    return next ? fetch(next, {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` }
    }).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }).then(data => {
        // console.log(data);
        for (const i of data.items) {
            playlist.songs.push(
                {
                    songID: uuid(),
                    artist: i.track.artists[0].name,
                    name: i.track.name,
                    type: 'spotify',
                    link: i.track.uri,
                    imageLink: i.track.album.images[0].url,
                    album: i.track.album.name,
                    duration: i.track.duration_ms,
                    releaseDate: i.track.album.release_date,
                }
            );
        }
        if (data.next) {
            return getTracksHelper(access_token, data.next, playlist);
        } else {
            return playlist;
        }
    }) // don't catch, let error bubble up to route handler
        :
        playlist;
}

// TODO: test to make sure this doesn't get rate-limited on reasonably sized playlists
router.post('/importManySpotify', async (req, res, next) => {
    const { playlists, access_token } = req.body;

    let queryUrl;

    Promise.allSettled(playlists?.map(playlist => {

        const type = playlist.type;

        if   (type === TYPE_PLAYLIST) queryUrl = `https://api.spotify.com/v1/playlists/${playlist.id}`;
        else if (type === TYPE_ALBUM) queryUrl = `https://api.spotify.com/v1/albums/${playlist.id}`;
        else {
            return res.status(400).send({ error: "one of the playlists ID's had invalid type (not playlist or album)" });
        }

        return fetch(queryUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${access_token}` }
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(data => getTracksHelper(access_token, data.tracks.href, {
            playlistID: uuid(),
            dateCreated: new Date(),
            description: data.description,
            name: data.name,
            author: new ObjectId(), // TODO: objectid of the user who is importing the playlist
            isFavorited: false,
            coverImageURL: data.images[0].url,
            songs: [],
            originSpotifyId: data.id,
            isAlbum: false,
        })
        ).then(async (playlist) => {
            const result = await playlistsCol.insertOne(playlist);
            console.log(`inserted ${result.insertedId}`);
            return playlist.originSpotifyId; // useful for frontend retry
        })
    }))
        .then(outcomes => {
            if (!outcomes.some((o) => o.status === "fulfilled")) {
                return res.status(500).send(outcomes);
            }
            return res.status(200).send(outcomes);
        })
    // NOTE: no catch, Promise.allSettled never rejects.
});

module.exports = router;