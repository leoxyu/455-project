const express = require('express');
var router = express.Router();

const querystring = require('querystring');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const client_id = '27604080756-2btdk60i5tahi5i4687pokqj56bavkcb.apps.googleusercontent.com';
const client_secret = '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'; // important to protect this one
const callback_uri = 'http://localhost:3000/login';

let access_token = null;
let refresh_token = null;
let youtube_profile = null;

const { MongoClient, ObjectId } = require("mongodb");
const { DATABASE_NAME, PLAYLIST_COLLECTION } = require("../shared/mongoConstants");

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const playlistsCol = database.collection(PLAYLIST_COLLECTION);

// const querystring = require('querystring');
require('dotenv').config();

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

  return res.send({ redirect_url });
});

router.get('/playlists', async (req, res) => { // handle login request from the hyperlink on html page

  const accessToken = req.headers.authorization;
  // Validate if the Authorization header is present and starts with 'Bearer '
  if (!accessToken || !accessToken.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid or missing access token' });
  }
  const token = accessToken.split(' ')[1];

  const playlists = await getYoutubePlaylists(token);
  console.log(playlists);

  for (let i = 0; i < playlists.length; i++) {
    try {
      const playlist = playlists[i];
      console.log(await (playlistsCol.find({ ['playlistID']: playlist.playlistID })).toArray())
      console.log((await (playlistsCol.find({ ['playlistID']: playlist.playlistID })).toArray()).length == 0)
      if ((await (playlistsCol.find({ ['playlistID']: playlist.playlistID })).toArray()).length == 0) {
        const result = await playlistsCol.insertOne(playlist);
      } else {
        console.log(`playlist ${playlist.playlistID} already exists in database`);
      }

    } catch (error) {
      console.log(error);
    }
  }

  console.log('shit is working');
  return res.send({});
});


async function getYoutubePlaylists(token) {
  // set up call to get youtube playlist IDs
  const params = {
    part: 'snippet',
    mine: true
  };
  const queryString = new URLSearchParams(params).toString();
  const url = `https://www.googleapis.com/youtube/v3/playlists?${queryString}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  const playlistDataList = data.items;

  const playlistList = [];

  // set up call for getting actual playlist items
  for (let i = 0; i < playlistDataList.length; i++) {
    const paramsPlaylistItem = {
      part: 'snippet',
      playlistId: playlistDataList[i].id
    };
    const queryStringPlaylistItem = new URLSearchParams(paramsPlaylistItem).toString();
    const urlPlaylistItem = `https://www.googleapis.com/youtube/v3/playlistItems?${queryStringPlaylistItem}`;
    const responsePlaylistItem = await fetch(urlPlaylistItem, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const dataPlaylistItem = await responsePlaylistItem.json();
    const songDataList = dataPlaylistItem.items;

    const songList = [];

    for (let i = 0; i < songDataList.length; i++) {
      const song = formatSong(
        songDataList[i].id,
        songDataList[i].snippet.videoOwnerChannelTitle,
        songDataList[i].snippet.title,
        songDataList[i].snippet.resourceId.videoId,
        songDataList[i].snippet.thumbnails.medium,
        songDataList[i].snippet,
        songDataList[i].snippet,
        songDataList[i].snippet,
        songDataList[i].snippet,
      );
      songList.push(song);
    }

    const playlist = formatPlaylist(
      playlistDataList[i].etag,
      playlistDataList[i].snippet.publishedAt,
      playlistDataList[i].snippet.description,
      playlistDataList[i].snippet.title,
      playlistDataList[i].snippet.channelTitle,
      false,
      playlistDataList[i].snippet.thumbnails.medium.url,
      songList,
      null,
      null
    );

    playlistList.push(playlist);
  }
  return playlistList;
}


function formatSong(
  songID,
  artist,
  name,
  link,
  imageLink,
  album,
  duration,
  releaseDate
) {
  return {
    songID: songID,
    artist: artist,
    name: name,
    type: 'youtube',
    link: link,
    imageLink: imageLink,
    album: album,
    duration: duration,
    releaseDate: releaseDate,
  };
}

function formatPlaylist(
  playlistID,
  dateCreated,
  description,
  name,
  author,
  isFavorited,
  coverImageURL,
  songs,
  originSpotifyId,
  isAlbum
) {
  return {
    playlistID: playlistID,
    dateCreated: dateCreated,
    description: description,
    name: name,
    author: author,
    isFavorited: isFavorited,
    coverImageURL: coverImageURL,
    songs: songs,
    originSpotifyId: originSpotifyId,
    isAlbum: isAlbum,
  };
}

module.exports = router;  