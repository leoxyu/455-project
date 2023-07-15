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

const youtube = require('scrape-youtube');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const { first } = require('lodash');


async function ytSearchVideo(videoName) {
    const filters1 = await ytsr.getFilters(videoName);
    const filter1 = filters1.get('Type').get('Video');
    // const filters2 = await ytsr.getFilters(filter1.url);
    // console.log(filters2); look into this later
    // const filter2 = filters2.get('Features').get('Live');
    const options = {
      pages: 1, // 5 is roughly 100 results
    }
    const searchResults = await ytsr(filter1.url, options);
    // const searchResults2 = await ytsr.continueReq(searchResults.continuation, options);
    // const searchResults3 = await ytsr.continueReq(searchResults2.continuation, options);

    
    // const info = await ytdl.getInfo(target.link);
    console.log(searchResults);

    // searchresults -> keep .items and .continuation

    // searchResults.items[0] -> 
    // {
    //   type: 'video',
    //   title: 'Short Change Hero', *** keep
    //   id: 'GjTTB6yII4o',
    //   url: 'https://www.youtube.com/watch?v=GjTTB6yII4o', *** keep
    //   bestThumbnail: [Object], *** keep but look closer into this
    //   thumbnails: [Array],
    //   isUpcoming: false,
    //   upcoming: null,
    //   isLive: false,
    //   badges: [],
    //   author: [Object],
    //   description: null,
    //   views: 21575889,
    //   duration: '5:23',
    //   uploadedAt: null
    // },







    console.log(searchResults.items.length);
    // console.log(searchResults2.items.length);
    // console.log(searchResults3.items.length);
    // when none left, then { continuation: null, items: [] }
    

    // console.log(filters1);
    // console.log(secondResultBatch.items);
    // console.log(thirdResultBatch.items);
    
    // console.log(info.videoDetails.title); // Short Change Hero
    // console.log(info.videoDetails.uploadDate); // 2017-02-11
    // console.log(info.videoDetails.dislikes); // 8046
    // console.log(info.videoDetails.channelId); // UCbGFbVqBTN3aCjUwz3FChFw
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
    ytSearchVideo("short change hero");
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



playlistsRouter.patch('/:playlistID', (req, res, next) => {
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
