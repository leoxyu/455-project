var express = require('express');
var playlistsRouter = express.Router();
const { v4: uuid } = require('uuid');

const { MongoClient, ObjectId } = require("mongodb");
const { DATABASE_NAME, PLAYLIST_COLLECTION, PLAYLIST_COLLECTION_TEST } = require("../shared/mongoConstants");
const {TYPE_ALBUM, TYPE_PLAYLIST, TYPE_SPOTIFY} = require("../shared/playlistTypeConstants");
// const querystring = require('querystring');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const playlistsCol = database.collection(PLAYLIST_COLLECTION_TEST);





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

  console.log("\r\ninside getTrackHelper");
  console.log("\r\nplaylist.isAlbum: ", playlist.isAlbum);

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

      if (playlist.isAlbum) {
        // playlist is TYPE_ALBUM
        const parsedTrack = {
          songID: uuid(),
          artist: i.artists[0].name,
          name: i.name,
          source: TYPE_SPOTIFY,
          link: i.uri,
          imageLink: playlist.coverImageURL,
          album: playlist.name,
          duration: i.duration_ms,
          releaseDate: playlist.dateCreated,
        };
        console.log(parsedTrack);
        playlist.songs.push(parsedTrack);
      } else {
        // playlist is TYPE_PLAYLIST
        const parsedTrack = {
          songID: uuid(),
          artist: i.track.artists[0].name,
          name: i.track.name,
          source: TYPE_SPOTIFY,
          link: i.track.uri,
          imageLink: i.track.album.images[0].url,
          album: i.track.album.name,
          duration: i.track.duration_ms,
          releaseDate: i.track.album.release_date,
        };
        console.log(parsedTrack);
        playlist.songs.push(parsedTrack);
      }

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

  console.log("inside importManySpotify");
  console.log(req.body);


  const { playlists, accessToken, authorID } = req.body;

  // console.log("\r\nreq body: ");
  // console.log(req.body);

  // console.log("\r\nplaylistIDs: ");
  // console.log(playlists);

  // console.log("\r\naccess_token: ");
  // console.log(accessToken);

  console.log("\r\nauthorID: ");
  console.log(authorID);



  Promise.allSettled(playlists?.map(playlist => {

    const type = playlist.playlistType;
    console.log(type);

    let queryUrl;

    if (type === TYPE_PLAYLIST) queryUrl = `https://api.spotify.com/v1/playlists/${playlist.id}`;
    else if (type === TYPE_ALBUM) queryUrl = `https://api.spotify.com/v1/albums/${playlist.id}`;
    else {
      return res.status(400).send({ error: "one of the playlists ID's had invalid type (not playlist or album)" });
    }


    return fetch(queryUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` }
    }).then(response => {

      if (response.status === 200) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    }).then(data => getTracksHelper(accessToken, data.tracks.href, {
      playlistID: uuid(),
      dateCreated: data.type === TYPE_ALBUM ? data.release_date : new Date(), // sets to releaseDate if album. Playlist don't have a release date, so just set to import/creation time
      description: data.description,
      name: data.name,
      author: new ObjectId(authorID), // TODO: objectid of the user who is importing the playlist
      artist: data.type === TYPE_ALBUM ? data.artists[0]?.name : data.owner.display_name,
      isFavorited: false,
      coverImageURL: data.images[0].url,
      songs: [],
      originSpotifyId: data.id,
      isAlbum: data.type === TYPE_ALBUM ? true : false,
      source: TYPE_SPOTIFY,
      type: data.type === TYPE_ALBUM ? TYPE_ALBUM : TYPE_PLAYLIST,
      duration: data.tracks?.total,
    })
    ).then(async (playlist) => {
      // console.log(playlist);
      const result = await playlistsCol.insertOne(playlist);
      console.log(`inserted ${result.insertedId}`);
      return playlist.originSpotifyId; // useful for frontend retry
    })
  }))
    .then(outcomes => {
      if (!outcomes.some((o) => o.status === "fulfilled")) {
        console.log(outcomes);
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
      query["_id"] = { $gt: new ObjectId(lastId) };
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
      .send({ data: page, lastId: page.length ? page[page.length - 1]._id : lastId });
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
