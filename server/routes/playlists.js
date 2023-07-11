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
      playlist.songs.push({ artist: i.track.artists[0].name, name: i.track.name, type: 'spotify', link: i.track.uri }); // best for performance
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
  console.log(access_token);
  
  Promise.all(playlistIDs.map(id => {
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
        id: v4(),
        dateCreated: new Date(),
        description: data.description,
        name: data.name,
        author: new ObjectId(), // TODO: objectid of the user who is importing the playlist
        isFavorited: false,
        coverImageURL: data.images[0].url,
        songs: [],
      })
    ).then(async (playlist) => {
      const result = await playlistsCol.insertOne(playlist);
      console.log(`inserted ${result.insertedId}`);
      return playlist.id; // return the uuid
    })
  }))
  .then(ids => {
    console.log(ids);
    res.status(200).send(ids)
  }).catch(error => { // catch outside promise.all, don't catch inside
    // TODO: rollback all playlists already added to db
    console.log(error);
    return res.status(500).send(error);
  });
});
  

playlistsRouter.get('/', async (req, res, next) => {
  // TODO: sort, filter, pagination
  const allItems = await playlistsCol.find({}).toArray();
  return res
  .setHeader('Content-Type', 'application/json')
  .status(200)
  .send(allItems);
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
