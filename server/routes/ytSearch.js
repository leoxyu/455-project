var express = require('express');
const ytsr = require('ytsr');
const yts = require('yt-search');
const { v4: uuid } = require('uuid');

var ytSearchRouter = express.Router();
// var videosNext = null;
// var playlistsNext = null;


async function ytParseVideo(item) {
    try {
      const info = await yts({videoId: item.id});
      // console.log('finished parsing ' + item.id);
      return {
        'songName': info.title,
        'artists':[info.author.name],
        'thumbnailUrl': info.thumbnail,
        'views': info.views,
        'genres': [info.genre],
        'audioFeatures':[],
        'duration': info.timestamp,
        'songLink': info.url,
      };
    }
    catch(e) {
      console.log('failed ' + item.id);
      return null;
    }
    
}


function ytParseVideoFrPlaylist(info) {
  return {
    'songName': info.title,
    'artists':[info.author.name],
    'thumbnailUrl': info.thumbnail,
    // 'views': info.views, need additional query for this
    // 'genres': [info.genre], need additional query for this
    // 'audioFeatures':[], need additional query for this
    'duration': info.duration.timestamp,
    'songLink': 'https://youtube.com/watch?v='+info.videoId, // TODO extract this out as constant
  };
}

async function ytSearchVideoNext(videosNext) {
  
  const options = {
    pages: 1, // 5 is roughly 100 results
  }
  //  for pagination
  const searchResults = await ytsr.continueReq(videosNext, options);
  searchResults.items = searchResults.items.filter((item) => item.type === 'video');
  searchResults.items =  await Promise.all(searchResults.items.map(ytParseVideo));
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
  searchResults.items =  await Promise.all(searchResults.items.map(ytParseVideo));
  searchResults.items = searchResults.items.filter((item) => item !== null);
  return searchResults;
}

async function ytSearchPlaylist(playlistName) {
  const filters1 = await ytsr.getFilters(playlistName);
  const filter1 = filters1.get('Type').get('Playlist');
  const searchResults = await ytsr(filter1.url, {pages: 1});
  searchResults.items =  await Promise.all(searchResults.items.map(async (item) => {
    const info = await yts({listId: item.playlistID});
    return {
      'playlistName':info.title,
      'artistName':[info.author.name],
      'thumbnailUrl': info.thumbnail,
      'songs':info.videos.map(ytParseVideoFrPlaylist),
      'duration':info.videos.length,
      'playlistLink': info.url,
      'tracksNextLink':null, //not needed for this package; null to match spotify 
      'popularity':info.views,
    };
  }));
  return searchResults;
}


async function ytSearchPlaylistNext(playlistsNext) {
  const searchResults = await ytsr.continueReq(playlistsNext, {pages: 1});
  searchResults.items =  await Promise.all(searchResults.items.map(async (item) => {
    const info = await yts({listId: item.playlistID});
    return {
      'playlistName':info.title,
      'artistName':[info.author.name],
      'thumbnailUrl': info.thumbnail,
      'songs':info.videos.map(ytParseVideoFrPlaylist),
      'duration':info.videos.length,
      'playlistLink': info.url,
      'tracksNextLink':null, //not needed for this package; null to match spotify 
      'popularity':info.views,
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

  

//  q is search query
// type is either 'videos', 'playlists', or 'all'
ytSearchRouter.get('/', rateLimitMiddleware, async (req, res) => {
    try {
      const searchTerm = req.query.q; // Get the search term from the query parameters
      const searchType = req.query.type || 'all'; // Get the search type from the query parameters (default to 'all')
  
      if (!searchTerm) {
        return res.status(400).json({ error: 'Youtube Search term is missing.' });
      }
      const searchResults ={};
  
      // Call a function to fetch YouTube search results using the YouTube Data API
      if (searchType === 'video' || searchType === 'all') {
        const videoResults = await ytSearchVideo(searchTerm);
        searchResults.videos = videoResults.items;
        const nextVideoCookie = uuid();
        res.cookie(nextVideoCookie, videoResults.continuation);
        searchResults.nextVideoCookie = nextVideoCookie;
      }
      
      if (searchType === 'playlist' || searchType === 'all') {
        const playlistResults = await ytSearchPlaylist(searchTerm);
        searchResults.playlists = playlistResults.items;
        const nextPlaylistCookie = uuid();
        res.cookie(nextPlaylistCookie, playlistResults.continuation);
        searchResults.nextPlaylistCookie = nextPlaylistCookie;
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
      const searchResults ={};
  
      // Call a function to fetch YouTube search results using the YouTube Data API
      if (cookieId && (searchType === 'video')) {
        const videoResults = await ytSearchVideoNext(continuation);
        searchResults.videos = videoResults.items;
        res.cookie(cookieId, videoResults.continuation);
        searchResults.nextVideoCookie = cookieId;
      }
      
      if (cookieId && (searchType === 'playlist')) {
        const playlistResults = await ytSearchPlaylistNext(continuation);
        searchResults.playlists = playlistResults.items;
        res.cookie(cookieId, playlistResults.continuation);
        searchResults.nextPlaylistCookie = cookieId;
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
