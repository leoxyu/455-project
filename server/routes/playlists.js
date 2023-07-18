// import { Router } from 'express';
// import { useSelector, useDispatch } from 'react-redux';
// import { addPlaylist, resetDeck, deletePlaylist, modifyPlaylist } from '../../src/redux/inventory';
var express = require('express');
var playlistsRouter = express.Router();
const { v4: uuid } = require('uuid');

var playlists= [
    {
        playlistID: '1',
        name: 'Playlist 1',
        dateCreated: '2023-06-09',
        description: 'bla bla',
        author: 'Ning Leng',
        isFavorited: false,
        coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',
        songs: [
            {
                source: 'Spotify',
                URI: 'http://'
            },
            {
                source: 'Spotify',
                URI: '2k76aPyqAiGhTm68fjB2u8'
            },
            {
                source: 'Youtube',
                URI: 'DLzxrzFCyOs'
            }
        ]
    },
    {
      playlistID: '2',
      name: 'Playlist 2',
      dateCreated: '2023-06-09',
      description: 'bla bla',
      author: 'Ning Ning',
      isFavorited: false,
      coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',
      songs: [
          {
              source: 'Spotify',
              URI: '0upq5GkOZ25DoExIOyWHkE'
          },
          {
              source: 'Spotify',
              URI: '2k76aPyqAiGhTm68fjB2u8'
          },
          {
              source: 'Youtube',
              URI: 'DLzxrzFCyOs'
          }
      ]
    },
    { playlistID: '2', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
    { playlistID: '3', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
    { playlistID: '4', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
    { playlistID: '5', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
    { playlistID: '6', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},
    { playlistID: '7', name: 'Playlist 3', author: 'Ning Ning', coverImageURL: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',},

];

const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const ytpl = require('ytpl');


async function ytParseVideo(item) {
    // console.log('queried ' + item.id); //ffs
    try {
      // check for later
      // https://github.com/fent/node-ytdl-core/issues/1139
      const info = await ytdl.getInfo(item.id);
      // console.log('passed ' + item.id); //ffs
    }
    catch(e) {
      console.log('failed ' + item.id); //ffs
      throw e;
    }
    return {
      'songName':item.title,
      'artists':[item.author.name],
      'thumbnailUrl': item.bestThumbnail.url,
      // 'views': info.videoDetails.viewCount,
      // 'genres':info.videoDetails.keywords,
      'audioFeatures':[],
      'duration': item.duration,
      'songLink': ("shortUrl" in item) ? item.shortUrl:item.url,
    };
}

async function ytSearchVideo(videoName) {
    const filters1 = await ytsr.getFilters(videoName);
    const filter1 = filters1.get('Type').get('Video');
    const filters2 = await ytsr.getFilters(filter1.url);
    // console.log(filters2); //look into this later for sorting
    const options = {
      pages: 5, // 5 is roughly 100 results
    }
    const searchResults = await ytsr(filter1.url, options);
    //  for pagination
    // const searchResults2 = await ytsr.continueReq(searchResults.continuation, options);
    
    // searchresults -> keep .items and .continuation
    searchResults.items = searchResults.items.filter((item) => item.type === 'video');
    searchResults.items =  await Promise.all(searchResults.items.map(ytParseVideo));
    // console.log(searchResults.items[0]);
    
    //  comments for todos later
    // when none left, then { continuation: null, items: [] }
    
    
    // console.log(info.videoDetails.title); // Short Change Hero
    // console.log(info.videoDetails.uploadDate); // 2017-02-11
    // console.log(info.videoDetails.dislikes); // 8046
    // console.log(info.videoDetails.channelId); // UCbGFbVqBTN3aCjUwz3FChFw
}


async function ytSearchPlaylist(playlistName) {
    const filters1 = await ytsr.getFilters(playlistName);
    const filter1 = filters1.get('Type').get('Playlist');
    const searchResults = await ytsr(filter1.url, {pages: 1});
    // console.log(searchResults.items[0]);
    
    searchResults.items =  await Promise.all(searchResults.items.map(async (item) => {
      const info = await ytpl(item.playlistID);
      const songsList = await Promise.all(info.items.map(ytParseVideo));
      return {
        'playlistName':item.title,
        'artistName':[item.owner.name],
        'thumbnailUrl': item.firstVideo.bestThumbnail.url,
        // 'genres':[],//[].concat(songsList.map((item) => item.genres)), // need to unify across all songs
        'songs':songsList,
        'duration':item.length,
        'playlistLink': item.playlistID,
        'tracksNextLink':info.continuation,
        'popularity':info.views,
        // 'playlistLink': item.playlistID,
      };
    }));

    console.log(searchResults.items[0].songs[0]);

    
    // console.log(searchResults.items[0]);
    // console.log(searchResults.items[0].url);
    // console.log(searchResults.items[0].bestThumbnail.url);
    // console.log(searchResults.items[0].title);
    // console.log(searchResults.items[0].author.name);
    // console.log(searchResults.items[0].duration);
    // console.log(searchResults.items[0].views);
    // console.log(searchResults.items[0].description);
    // console.log(searchResults.items[0].uploadedAt);
    // console.log(searchResults.items[0].id);
}
function addPlaylist(action) {
    action.playlistID = uuid();
    //  TODO make these customizable to users later via client
    const currentISODate = new Date().toISOString().split('T')[0];
    action.dateCreated= currentISODate;
    action.description= 'This is a playlist';
    action.author= action.author;
    action.isFavorited= false;
    action.coverImageURL= 'https://zerojackerzz.com/wp-content/uploads/2019/10/album-placeholder.png'

    // end of TOOD
    // ytSearchVideo("short change hero");
    ytSearchPlaylist("pewdiepie");
    console.log('yt res should have finished');
    playlists.push(action);
}

function resetDeck() {
    playlists.splice(0, playlists.length);
    counts = {}
}


function deletePlaylist(action) {
  const index = playlists.findIndex((playlist) => playlist.playlistID === action);
  if (index === -1) {
    throw new Error("Playlist not found in inventory");
  }
  playlists.splice(index, 1);
}

function modifyPlaylist(action, index) {
  if (index === -1) {
    throw new Error("Playlist not found in inventory");
  }
  playlists[index] = action;
}



playlistsRouter.post('/', (req, res, next) => {
    addPlaylist(req.body);
  return res
  .setHeader('Content-Type', 'application/json')
  .status(201)
  .send(playlists[playlists.length - 1]);
});

playlistsRouter.get('/', (req, res, next) => {
//   const { name } = req.query;
  let filteredplaylists = playlists;

  // Apply search filters
//   if (name) {
//     const sanitizedName = sanitizeName(name);
//     filteredplaylists = filteredplaylists.filter(
//       (playlist) => sanitizeName(playlist.name).includes(sanitizedName)
//     );
//   }

// console.log(playlists);
  return res
  .setHeader('Content-Type', 'application/json')
  .status(200)
  .send(filteredplaylists);
});

playlistsRouter.delete('/:playlistId', (req, res, next) => {
    try {
        deletePlaylist(req.params.playlistId);
    }
    catch (err) {
        return res.status(204).json({ message: err.message });
    }
    return res
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send({});
});



playlistsRouter.patch('/:playlistID', (req, res,next) => {
    console.log(req.body);
    console.log(req.params);
    const index = playlists.findIndex((playlist) => playlist.playlistID === req.params.playlistID);
    try {
        modifyPlaylist(req.body, index);
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
    return res
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send(playlists[index]);
});

playlistsRouter.put('/', (req, res, next) => {
    resetDeck();

    return res
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send(playlists);
});







// adding songs bruh


playlistsRouter.post('/:playlistId', (req, res, next) => {
    // console.log(req);
    const { playlistId } = req.params;
    const { source, URI } = req.body;
  
    const playlistIndex = playlists.findIndex((playlist) => playlist.playlistID === playlistId);
    if (playlistIndex === -1) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
  
    const song = { source, URI };
    playlists[playlistIndex].songs.push(song);
  
    return res.status(201).json(song);
  });
  
  playlistsRouter.delete('/:playlistId/:songId', (req, res, next) => {
    const { playlistId, songId } = req.params;
  
    const playlistIndex = playlists.findIndex((playlist) => playlist.playlistID === playlistId);
    if (playlistIndex === -1) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
  
    const songIndex = playlists[playlistIndex].songs.findIndex((song) => song.URI === songId);
    if (songIndex === -1) {
      return res.status(404).json({ message: 'Song not found in playlist' });
    }
  
    playlists[playlistIndex].songs.splice(songIndex, 1);
  
    return res.status(204).send({});
  });
  






module.exports = playlistsRouter;
