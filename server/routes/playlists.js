// import { Router } from 'express';
// import { useSelector, useDispatch } from 'react-redux';
// import { addPlaylist, resetDeck, deletePlaylist, modifyPlaylist } from '../../src/redux/inventory';
var express = require('express');
var playlistsRouter = express.Router();
const { v4 } = require('uuid');

const { MongoClient, ObjectId } = require("mongodb");
const { DATABASE_NAME, PLAYLIST_COLLECTION } = require("../shared/mongoConstants");
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const playlistsCol = database.collection(PLAYLIST_COLLECTION);

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
          songID: v4(),
          artist: i.track.artists[0].name,
          name: i.track.name, 
          type: 'spotify', 
          link: i.track.uri,
          imageLink: i.track.album.images[0].url,
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
playlistsRouter.post('/importManySpotify', async (req, res, next) => {
  const { playlistIDs, access_token } = req.body;
  
  Promise.allSettled(playlistIDs.map(id => {
    return fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${access_token}` }
    }).then(response => {
      if (response.status === 200) {
          return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(data => getTracksHelper(access_token, data.tracks.href, {
        playlistID: v4(),
        dateCreated: new Date(),
        description: data.description,
        name: data.name,
        author: new ObjectId(), // TODO: objectid of the user who is importing the playlist
        isFavorited: false,
        coverImageURL: data.images[0].url,
        songs: [],
        originSpotifyId: data.id,
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

playlistsRouter.get('/', async (req, res, next) => {
  // TODO: sort, filter, pagination
  const allItems = await playlistsCol.find({}).toArray();
  return res
  .setHeader('Content-Type', 'application/json')
  .status(200)
  .send(allItems);
});

playlistsRouter.delete('/:playlistId', async (req, res, next) => {
  try {
    const result = await playlistsCol.deleteOne({ id: req.params.playlistId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    return res
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .send({});
  } catch (err) {
    return res.status(500).send(err);
  }
});

playlistsRouter.put('/:playlistID', async (req, res, next) => {
  const filter = { id: req.params.playlistID };
  const updateDocument = {
    $set: {
      ...req.body,
    },
  };

  try {
    const options = { returnDocument: "after" };
    const result = await playlistsCol.findOneAndUpdate(filter, updateDocument, options);
    if (result.lastErrorObject && result.lastErrorObject.updatedExisting === false) {
      return res.status(404).json({ message: "Invalid request body" });
    }
    return res
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .send(result);
  } catch (error) {
    if (error.codeName === "DocumentValidationFailure") {
      return res.status(400).send(error);
    }
    return res.status(500).send(error);
  }
});


// playlistsRouter.put('/', (req, res, next) => {
//     resetDeck();

//     return res
//     .setHeader('Content-Type', 'application/json')
//     .status(200)
//     .send(playlists);
// });







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
