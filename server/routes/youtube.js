const express = require('express');
var router = express.Router();
const querystring = require('querystring');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const client_id = '27604080756-2btdk60i5tahi5i4687pokqj56bavkcb.apps.googleusercontent.com';
const client_secret = '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'; // important to protect this one
const callback_uri = `${process.env.CLIENT_URL}/login`;

let access_token = null;
let refresh_token = null;
let youtube_profile = null;

const { MongoClient, ObjectId } = require("mongodb");
const { DATABASE_NAME, PLAYLIST_COLLECTION_TEST } = require("../shared/mongoConstants");

const YOUTUBE_URL = `https://www.youtube.com/watch?v=`

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const playlistsCol = database.collection(PLAYLIST_COLLECTION_TEST);

// const querystring = require('querystring');
require('dotenv').config();

router.use(cors());

router.get('/login', function (req, res) { // handle login request from the hyperlink on html page
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

router.get('/playlists', async (req, res) => {

  const accessToken = req.headers.authorization;
  if (!accessToken || !accessToken.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid or missing access token' });
  }
  const token = accessToken.split(' ')[1];
  const playlists = await getYoutubePlaylists(token, req.query.authorID);

  console.log(playlists);

  for (let i = 0; i < playlists.length; i++) {
    try {
      const playlist = playlists[i];
      if ((await (playlistsCol.find({ ['playlistID']: playlist.playlistID })).toArray()).length == 0) {
        const result = await playlistsCol.insertOne(playlist);
      } else {
        console.log(`playlist ${playlist.playlistID} already exists in database`);
      }

    } catch (error) {
      console.log(error);
    }
  }
  return res.send({});
});

async function getYoutubePlaylists(token, author) {
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
        'youtube',
        YOUTUBE_URL + songDataList[i].snippet.resourceId.videoId,
        songDataList[i].snippet.thumbnails.medium.url,
        null,
        null,
        songDataList[i].snippet.publishedAt,
      );
      songList.push(song);
    }

    const playlist = formatPlaylist(
      playlistDataList[i].etag,
      playlistDataList[i].snippet.publishedAt,
      playlistDataList[i].snippet.description,
      playlistDataList[i].snippet.title, // name
      new ObjectId(author),
      '',
      false,
      playlistDataList[i].snippet.thumbnails.medium.url,
      songList,
      null,
      playlistDataList[i].etag,
    );

    playlistList.push(playlist);
  }
  return playlistList;
}

function reformatTime(originalDate) {
  const dateObj = new Date(originalDate);

  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");

  const reformattedDate = `${year}-${month}-${day}`;
  return reformattedDate;
}

function formatSong(
  songID,
  artist,
  name,
  source,
  link,
  imageLink,
  album,
  duration,
  releaseDate
) {
  const formattedReleaseDate = reformatTime(releaseDate);
  return {
    songID: songID,
    artist: artist,
    name: name,
    source: source,
    link: link,
    imageLink: imageLink,
    album: album,
    duration: duration,
    releaseDate: formattedReleaseDate,
  };
}

function formatPlaylist(
  playlistID,
  dateCreated,
  description,
  name,
  author,
  artist,
  isFavorited,
  coverImageURL,
  songs,
  duration,
  originId
) {
  const formattedReleaseDate = reformatTime(dateCreated);
  return {
    playlistID: playlistID,
    name: name,
    dateCreated: formattedReleaseDate,
    description: description,
    author: author,
    isAlbum: false,
    artist: artist,
    artistImage: '',
    isFavorited: isFavorited,
    coverImageURL: coverImageURL,
    songs: songs,
    source: 'youtube',
    type: 'playlist',
    duration: duration,
    originId: originId
  };
}



module.exports = router;  