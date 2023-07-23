var express = require('express');
var playlistsRouter = express.Router();
const { v4: uuid } = require('uuid');

const { MongoClient, ObjectId } = require("mongodb");
const { DATABASE_NAME, PLAYLIST_COLLECTION } = require("../shared/mongoConstants");
// const querystring = require('querystring');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const playlistsCol = database.collection(PLAYLIST_COLLECTION);

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

playlistsRouter.post('/', async (req, res, next) => {
  const pl = {
    playlistID: uuid(),
    ...req.body,
    dateCreated: new Date(),
    author: new ObjectId(req.body.author),
    isFavorited: false,
    coverImageURL: '',
  };
  try {
    const result = await playlistsCol.insertOne(pl);
    console.log(`inserted ${result.insertedId}`);
    return res.status(200).send(pl);
  } catch (error) {
    if (error.codeName === "DocumentValidationFailure" || error.code === 121) {
      return res.status(400).send(error);
    }
    return res.status(500).send(error);
  }
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
playlistsRouter.post('/importManySpotify', async (req, res, next) => {
  const { playlistIDs, access_token } = req.body;

  Promise.allSettled(playlistIDs?.map(id => {
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

// ?lastId=ObjectId&deep=false&sortField=dateCreated&sortDir=-1
playlistsRouter.get('/', async (req, res, next) => {
  try {
    let { lastId, isDeep, sortDir, sortField, authorID } = req.query;
    isDeep = isDeep === 'true'
    sortDir = sortDir === '-1' ? -1 : 1;

    const query = {
      author: { $eq: new ObjectId(authorID) }
    };

    if (lastId) {
      query["_id"] =  { $gt: new ObjectId(lastId) };
    }

    const page = await playlistsCol
      .find(query)
      .sort(sortField, sortDir) // TODO: sorting by sort field should revert the cursor to start. add $gt for the sort field, id is just default.
      .project(isDeep ? {} : { songs: 0 })
      .limit(1) // TODO: set proper limit
      .toArray();
    if (!isDeep) page.forEach(p => p.songs = []);
    return res
      .setHeader('Content-Type', 'application/json')
      .status(200)
      .send({ data: page, lastId: page.length ? page[page.length-1]._id : lastId });
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

/*
Single playlist REST endpoints
*/

playlistsRouter.delete('/:playlistID', async (req, res, next) => {
  try {
    const result = await playlistsCol.deleteOne({ playlistID: req.params.playlistID });

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
  const filter = { playlistID: req.params.playlistID };
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
      .send(result.value);
  } catch (error) {
    if (error.codeName === "DocumentValidationFailure") {
      return res.status(400).send(error);
    }
    return res.status(500).send(error);
  }
});

playlistsRouter.get('/:playlistID', async (req, res, next) => {
  try {
    const { playlistID } = req.params;
    const result = await playlistsCol.findOne({ playlistID });
    if (!result) {
      return res.status(404).send('playlist not found');
    }
    return res
    .setHeader('Content-Type', 'application/json')
    .status(200)
    .send(result);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
});

/*
Single playlist songs REST endpoints
*/
// GET songs: redundant, get single playlist will have populated songs.
// GET single song: maybe useful, unimplemented for now.
// PUT: no meaningful put action for a single song.
// POST: only support adding songs to the end (like spotify does)
// DELETE: remove song from playlist.

// TODO: update frontend api calls to use new paths
playlistsRouter.post('/:playlistID/songs', async (req, res, next) => {
  const { playlistID } = req.params;
  try {
    const song = {
      addedBy: new ObjectId(), // TODO: replace with current user id
      songID: uuid(),
      ...req.body,
    };
    const result = await playlistsCol.updateOne(
      { playlistID },
      { $push: { songs: song } },
    );
    if (!result.modifiedCount) {
      return res.status(404).json({ message: `playlist ${playlistID} not found` });
    }
    return res.status(200).send({ playlistID, song });
  } catch (e) {
    console.log(e);
    if (e.codeName === "DocumentValidationFailure" || e.code === 121) {
      return res.status(400).send(e);
    }
    return res.status(500).send(e);
  }
});

playlistsRouter.delete('/:playlistID/songs/:songID', async (req, res, next) => {
  const { playlistID, songID } = req.params;

  try {
    const result = await playlistsCol.updateOne(
      { playlistID },
      { $pull: { songs: { songID } } },
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: `playlist ${playlistID} not found` });
    } else if (!result.modifiedCount) {
      return res.status(404).json({ message: `song ${songID} not found` });
    }
    return res.status(200).send({ playlistID, songID });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

module.exports = playlistsRouter;
