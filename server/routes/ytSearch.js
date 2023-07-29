var express = require('express');
const ytsr = require('ytsr');
const yts = require('yt-search');
const { v4: uuid } = require('uuid');

var ytSearchRouter = express.Router();

const { MongoClient, ObjectId } = require("mongodb");
const { DATABASE_NAME, PLAYLIST_COLLECTION } = require("../shared/mongoConstants");
const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const playlistsCol = database.collection(PLAYLIST_COLLECTION);
// var videosNext = null;
// var playlistsNext = null;

const NO_THUMBNAIL_PLACEHOLDER = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/YouTube_play_button_square_%282013-2017%29.svg/1200px-YouTube_play_button_square_%282013-2017%29.svg.png'

async function ytParseVideo(item) {
  try {
    const info = await yts({ videoId: item.id });
    // console.log('finished parsing ' + item.id);
    return {
      'songID': item.id,
      'artist': info.author.name,
      'name': info.title,
      'type': 'youtube',
      'link': info.url,
      'imageLink': info.thumbnail,
      'album': null,
      'duration': info.timestamp,
      'releaseDate': info.uploadDate,

      'views': info.views,
      'genres': [info.genre],
    };
  }
  catch (e) {
    console.log('failed ' + item.id);
    return null;
  }

}


function ytParseVideoFrPlaylist(info) {
  return {
    'songID': info.videoId,
    'artist': info.author.name,
    'name': info.title,
    'type': 'youtube',
    'link': 'https://youtube.com/watch?v=' + info.videoId,
    'imageLink': info.thumbnail,
    'album': null,
    'duration': info.duration.timestamp,
    'releaseDate': info.uploadDate,

    // 'views': info.views, need additional query for this
    // 'genres': [info.genre], need additional query for this
  };
}

async function ytSearchVideoNext(videosNext) {

  const options = {
    pages: 1, // 5 is roughly 100 results
  }
  //  for pagination
  const searchResults = await ytsr.continueReq(videosNext, options);
  searchResults.items = searchResults.items.filter((item) => item.type === 'video');
  searchResults.items = await Promise.all(searchResults.items.map(ytParseVideo));
  searchResults.items = searchResults.items.filter((item) => item !== null);
  // console.log(searchResults);
  // when none left, then { continuation: null, items: [] }
  return searchResults;
}


async function ytSearchVideo(videoName) {
  const filters1 = await ytsr.getFilters(videoName);
  const filter1 = filters1.get('Type').get('Video');
  // const filters2 = await ytsr.getFilters(filter1.url); additonal filters for sorting and such
  const options = {
    pages: 1, // 5 is roughly 100 results
  }
  const searchResults = await ytsr(filter1.url, options);
  //  for pagination
  // const searchResults2 = await ytsr.continueReq(searchResults.continuation, options);
  searchResults.items = searchResults.items.filter((item) => item.type === 'video');
  searchResults.items = await Promise.all(searchResults.items.map(ytParseVideo));
  searchResults.items = searchResults.items.filter((item) => item !== null);
  return searchResults;
}

async function getPlaylistData(playlistID) {
  const info = await yts({ listId: playlistID });
  return {
    // uuid not created
    'dateCreated': info.date,
    'description': null, // no way to get it without manually parsing html
    'name': info.title,
    'author': info.author.name,
    'isFavorited': false,
    'coverImageURL': info.thumbnail,
    'songs': info.videos.map(ytParseVideoFrPlaylist),
    'originId': playlistID,
    'isAlbum': false,

    // extra
    'duration': info.videos.length,
    'popularity': info.views,
    'type': 'youtube',
  };
}

async function ytSearchPlaylist(playlistName) {
  const filters1 = await ytsr.getFilters(playlistName);
  const filter1 = filters1.get('Type').get('Playlist');
  const searchResults = await ytsr(filter1.url, { pages: 1 });
  searchResults.items = searchResults.items.map((item) => {
    return {
      // uuid not created
      'dateCreated': null,
      'description': null, // no way to get it without manually parsing html
      'name': item.title,
      'author': item.owner.name,
      'isFavorited': false,
      'coverImageURL': (item.firstVideo) ? item.firstVideo.thumbnails[0].url : NO_THUMBNAIL_PLACEHOLDER,
      'songs': item.playlistID,
      'originId': item.playlistID,
      'isAlbum': false,

      // extra
      'previewDetails': (item.firstVideo) ? item.firstVideo.title + ' • ' + item.firstVideo.length : null,
      'duration': item.length,
      'type': 'youtube',
    };
  });
  return searchResults;
}


async function ytSearchPlaylistNext(playlistsNext) {
  const searchResults = await ytsr.continueReq(playlistsNext, { pages: 1 });
  searchResults.items = await Promise.all(searchResults.items.map(async (item) => {
    const info = await yts({ listId: item.playlistID });
    return {
      // uuid not created
      'dateCreated': info.date,
      'description': null, // no way to get it without manually parsing html
      'name': info.title,
      'author': info.author.name,
      'isFavorited': false,
      'coverImageURL': info.thumbnail,
      'songs': info.videos.map(ytParseVideoFrPlaylist),
      'originId': info.url,
      'isAlbum': false,

      // extra
      'duration': info.videos.length,
      'popularity': info.views,
      'type': 'youtube',
    };
  }));
  return searchResults;
}

// Function to delay the next request by 3 seconds
const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));


// Middleware to enforce rate limit of 3 seconds
const rateLimitMiddleware = async (req, res, next) => {
  await delay(2000);
  next();
};


async function pushPlaylistToDatabase(playlist) {
  if ((await (playlistsCol.find({ ['playlistID']: playlist.playlistID })).toArray()).length == 0) {
    const result = await playlistsCol.insertOne(playlist);
  } else {
    console.log(`playlist ${playlist.playlistID} already exists in database`);
  }
}

ytSearchRouter.get('/playlists/:playlistID', rateLimitMiddleware, async (req, res) => {
  try {
    const pushToDatabase = req.query.pushToDatabase;
    const playlistID = req.params.playlistID;
    playlistDetails = await getPlaylistData(playlistID);

    if (pushToDatabase == 'true') {
      const author = req.query.authorID;
      playlistDetails.author = new ObjectId(author);
      playlistDetails.playlistID = playlistID;
      await pushPlaylistToDatabase(playlistDetails);
    }

    return res
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .send(playlistDetails);
  } catch (error) {
    console.error('Error fetching YouTube search results:', error);
    res.status(500).json({ error: 'Something went wrong with YouTube.' });
  }
});

//  q is search query
// type is either 'videos', 'playlists', or 'all'
ytSearchRouter.get('/', rateLimitMiddleware, async (req, res) => {
  try {
    const searchTerm = req.query.q; // Get the search term from the query parameters
    const searchType = req.query.type || 'all'; // Get the search type from the query parameters (default to 'all')

    if (!searchTerm) {
      return res.status(400).json({ error: 'Youtube Search term is missing.' });
    }
    const searchResults = {};

    // Call a function to fetch YouTube search results using the YouTube Data API
    if (searchType === 'video' || searchType === 'all') {
      const videoResults = await ytSearchVideo(searchTerm);
      // searchResults.videos = videoResults.items;
      const nextVideoCookie = uuid();
      res.cookie(nextVideoCookie, videoResults.continuation);
      // searchResults.nextVideoCookie = nextVideoCookie;

      searchResults.videos = {
        'items': videoResults.items,
        'next': nextVideoCookie,
      };
    }

    if (searchType === 'playlist' || searchType === 'all') {
      const playlistResults = await ytSearchPlaylist(searchTerm);
      // searchResults.playlists = playlistResults.items;
      const nextPlaylistCookie = uuid();
      res.cookie(nextPlaylistCookie, playlistResults.continuation);
      // searchResults.nextPlaylistCookie = nextPlaylistCookie;

      searchResults.playlists = {
        'items': playlistResults.items,
        'next': nextPlaylistCookie,
      };
    }
    return res
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .send(searchResults);
  } catch (error) {
    console.error('Error fetching YouTube search results:', error);
    res.status(500).json({ error: 'Something went wrong with YouTube.' });
  }
});


// type is either 'videos', 'playlists', or 'all'
ytSearchRouter.get('/next', rateLimitMiddleware, async (req, res) => {
  try {
    const searchType = req.query.type;
    const cookieId = req.query.cookieId;
    const continuation = req.cookies[cookieId];

    // Check if the cookieId is provided in the query parameters
    if (!cookieId) {
      return res.status(400).json({ error: 'Missing cookieId in the request.' });
    }

    // Check if the continuation is null or missing
    if (!continuation) {
      return res.status(400).json({ error: 'Invalid or expired continuation token.' });
    }

    if (!searchType) {
      return res.status(400).json({ error: 'No search type specified.' });
    }
    const searchResults = {};

    // Call a function to fetch YouTube search results using the YouTube Data API
    if (cookieId && (searchType === 'video')) {
      const videoResults = await ytSearchVideoNext(continuation);
      // searchResults.videos = videoResults.items;
      res.cookie(cookieId, videoResults.continuation);
      // searchResults.nextVideoCookie = cookieId;
      searchResults.videos = {
        'items': videoResults.items,
        'next': cookieId,
      };
    }

    if (cookieId && (searchType === 'playlist')) {
      const playlistResults = await ytSearchPlaylistNext(continuation);
      // searchResults.playlists = playlistResults.items;
      res.cookie(cookieId, playlistResults.continuation);
      // searchResults.nextPlaylistCookie = cookieId;
      searchResults.playlists = {
        'items': playlistResults.items,
        'next': cookieId,
      };
    }
    return res
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .send(searchResults);
  } catch (error) {
    console.error('Error fetching YouTube search results:', error);
    res.status(500).json({ error: 'Something went wrong with YouTube.' });
  }
});

module.exports = ytSearchRouter;