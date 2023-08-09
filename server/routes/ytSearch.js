var express = require('express');
const ytsr = require('ytsr');
const yts = require('yt-search');
const { Mutex } = require('async-mutex');

// Create a mutex
const continuationMapMutex = new Mutex();

var ytSearchRouter = express.Router();

const { DATABASE_NAME, PLAYLIST_COLLECTION_TEST } = require("../shared/mongoConstants");
const {  TYPE_PLAYLIST, TYPE_YOUTUBE } = require("../shared/playlistTypeConstants");

const { MongoClient, ObjectId } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const playlistsCol = database.collection(PLAYLIST_COLLECTION_TEST);
// var videosNext = null;
// var playlistsNext = null;

const NO_THUMBNAIL_PLACEHOLDER = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/YouTube_play_button_square_%282013-2017%29.svg/1200px-YouTube_play_button_square_%282013-2017%29.svg.png'


// Function to delay the next request by 3 seconds
const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

// Middleware to enforce rate limit of 3 seconds
const rateLimitMiddleware = async (req, res, next) => {
  await delay(2000);
  next();
};

const continuationMap = {};

function deleteContinuationsWithPrefix(req, res, next) {
  const prefix = req.headers.userid;
  const continuationsToDelete = Object.keys(continuationMap).filter(name => name.startsWith(prefix));

  continuationsToDelete.forEach(con => {
    delete continuationMap[con];
  });
  next()
}


ytSearchRouter.use(rateLimitMiddleware);


async function ytParseVideo(item) {
  try {
    const info = await yts({ videoId: item.id });
    return {
      'songID': item.id,
      'artist': info.author.name,
      'name': info.title,
      'source': TYPE_YOUTUBE,
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
    return null;
  }
}

function ytParseVideoFrPlaylist(info) {
  return {
    'songID': info.videoId,
    'artist': info.author.name,
    'name': info.title,
    'source': TYPE_YOUTUBE,
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
    'artist': info.author.name,
    'source': TYPE_YOUTUBE,
    'type': TYPE_PLAYLIST,
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
      'artist': item.owner.name,
      'source': TYPE_YOUTUBE,
      'type': TYPE_PLAYLIST,
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
      'artist': info.author.name,
      'source': TYPE_YOUTUBE,
      'type': TYPE_PLAYLIST,
    };
  }));
  return searchResults;
}

async function pushPlaylistToDatabase(playlist) {
  if ((await (playlistsCol.find({ ['playlistID']: playlist.playlistID })).toArray()).length == 0) {
    const result = await playlistsCol.insertOne(playlist);
  } else {
    console.log(`playlist ${playlist.playlistID} already exists in database`);
  }
}

ytSearchRouter.get('/playlists/:playlistID', async (req, res) => {
  try {
    const playlistID = req.params.playlistID;
    const author = req.headers.authorid;
    playlistDetails = await getPlaylistData(playlistID);

    if (author) {
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

// Assuming you have access to the 'res' object

function expandSearchParamsInOrder(queryParams) {
  return queryParams.get('query') + queryParams.get('type') + queryParams.get('offset');
}

//  q is search query
// type is either 'videos', 'playlists', or 'all'
ytSearchRouter.get('/', async (req, res) => {
  try {
    const searchTerm = req.query.query; // Get the search term from the query parameters
    const searchType = req.query.type || 'all'; // Get the search type from the query parameters (default to 'all')
    const offset = req.query.offset;
    const userID = req.headers.userid;

    let release;
    if (!searchTerm) {
      return res.status(400).json({ error: 'Youtube Search term is missing.' });
    }
    if (!offset) {
      release = await continuationMapMutex.acquire();
      deleteContinuationsWithPrefix(req, res,()=>{});
      release();
    }

    const searchResults = {};
    // Call a function to fetch YouTube search results using the YouTube Data API
    if (searchType === 'video' || searchType === 'all') {
      if (!offset) {
        const videoResults = await ytSearchVideo(searchTerm);

        if (videoResults.continuation) {
          const queryParams = new URLSearchParams();
          queryParams.append('query', searchTerm);
          queryParams.append('type', 'video');
          queryParams.append('offset', 1);
          const nextVideoCookie = userID + expandSearchParamsInOrder(queryParams);
          // res.cookie(nextVideoCookie, videoResults.continuation);
          release = await continuationMapMutex.acquire();
          continuationMap[nextVideoCookie] = videoResults.continuation;
          release();
          searchResults.videos = {
            'items': videoResults.items,
            'next': queryParams.toString(),
          };
        } else {
          searchResults.videos = {
            'items': videoResults.items,
            'next': null,
          };
        }
      } else {
        const queryParams = new URLSearchParams();
        queryParams.append('query', searchTerm);
        queryParams.append('type', 'video');
        queryParams.append('offset', offset);
        const cookieId = userID + expandSearchParamsInOrder(queryParams);
        // const continuation = req.cookies[cookieId];
        release = await continuationMapMutex.acquire();
        const continuation = continuationMap[cookieId];
        release();

        const videoResults = await ytSearchVideoNext(continuation);

        if (videoResults.continuation){
          queryParams.set('offset', (parseInt(queryParams.get('offset')) + 1));

          const nextCookieId = userID + expandSearchParamsInOrder(queryParams);
          // res.cookie(nextCookieId, videoResults.continuation);
          release = await continuationMapMutex.acquire();
          continuationMap[nextCookieId] = videoResults.continuation;
          release();
          searchResults.videos = {
            'items': videoResults.items,
            'next': queryParams.toString(),
          };
        } else {
          searchResults.videos = {
            'items': videoResults.items,
            'next': null,
          };
        }
      }
    }

    if (searchType === 'playlist' || searchType === 'all') {
      if (!offset) {
        const playlistResults = await ytSearchPlaylist(searchTerm);

        if (playlistResults.continuation) {
          const queryParams = new URLSearchParams();
          queryParams.append('query', searchTerm);
          queryParams.append('type', 'playlist');
          queryParams.append('offset', 1);
          const nextPlaylistCookie = userID + expandSearchParamsInOrder(queryParams);
          // res.cookie(nextPlaylistCookie, playlistResults.continuation);
          release = await continuationMapMutex.acquire();
          continuationMap[nextPlaylistCookie] = playlistResults.continuation;
          release();
          searchResults.playlists = {
            'items': playlistResults.items,
            'next': queryParams.toString(),
          };
        } else {
          searchResults.playlists = {
            'items': playlistResults.items,
            'next': null,
          };
        }
      } else {
        const queryParams = new URLSearchParams();
        queryParams.append('query', searchTerm);
        queryParams.append('type', 'playlist');
        queryParams.append('offset', offset);
        const cookieId = userID + expandSearchParamsInOrder(queryParams);
        // const continuation = req.cookies[cookieId];
        release = await continuationMapMutex.acquire();
        const continuation = continuationMap[cookieId];
        release();
        const playlistResults = await ytSearchPlaylistNext(continuation);


        if (playlistResults.continuation){
          queryParams.set('offset', (parseInt(queryParams.get('offset')) + 1));

          const nextCookieId = userID + expandSearchParamsInOrder(queryParams);
          // res.cookie(nextCookieId, playlistResults.continuation);
          release = await continuationMapMutex.acquire();
          continuationMap[nextCookieId] = playlistResults.continuation;
          release();
          searchResults.playlists = {
            'items': playlistResults.items,
            'next': queryParams.toString(),
          };
        } else {
          searchResults.playlists = {
            'items': playlistResults.items,
            'next': null,
          };
        }
      }
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
