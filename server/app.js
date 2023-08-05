var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const { DATABASE_NAME, PLAYLIST_COLLECTION, PLAYLIST_COLLECTION_TEST } = require('./shared/mongoConstants');
const { v4: uuid } = require('uuid');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var playlistsRouter = require('./routes/playlists');

const { MongoClient, ObjectId } = require("mongodb");
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

async function setupCollections() {
  try {
    const database = client.db(DATABASE_NAME);
    const collections = await database.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    const validator = {
      $or: [
        {
          "isAlbum": { $eq: false }
        },
        {
          $and: [ { "artist": { $exists: true } } ]
        }
      ],
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "dateCreated", "description", "author", "isFavorited", "coverImageURL", "songs", "isAlbum"],
        properties: {
          playlistID: {
            bsonType: "string",
            description: "uuid",
          },
          name: {
            bsonType: "string",
            description: "Name of the object",
          },
          dateCreated: {
            bsonType: "date",
            description: "Creation date of the object",
          },
          description: {
            bsonType: "string",
            description: "Description of the object",
          },
          author: {
            bsonType: "objectId",
            description: "ObjectId of the unifi user who created this playlist",
          },
          isAlbum: {
            bsonType: "bool",
            description: "true if this playlist is a Spotify album, false otherwise",
          },
          artist: {
            bsonType: "string",
            description: "name of artist if this is a Spotify album",
          },
          artistImage: {
            bsonType: "string",
            description: "link to artist image",
          },
          isFavorited: {
            bsonType: "bool",
            description: "Flag indicating if the object is favorited",
          },
          coverImageURL: {
            bsonType: "string",
            description: "URL of the cover image",
          },
          songs: {
            bsonType: "array",
            description: "Array of songs",
            items: {
              bsonType: "object",
              required: ["songID", "artist", "name", "type", "link"],
              properties: {
                addedBy: {
                  bsonType: "objectid",
                  description: "ObjectId of the unifi user who added this song to the playlist",
                },
                songID: {
                  bsonType: "string",
                  description: "uuid",
                },
                artist: {
                  bsonType: "string",
                  description: "Name of the artist",
                },
                album: {
                  bsonType: "string",
                  description: "name of the album it's from",
                },
                duration: {
                  bsonType: "number",
                  description: "duration in ms",
                },
                releaseDate: {
                  bsonType: "string",
                  description: "release date of the song's album",
                },
                name: {
                  bsonType: "string",
                  description: "Name of the song",
                },
                type: {
                  bsonType: "string",
                  enum: ["spotify", "youtube"],
                  description: "Type of the song (spotify or youtube)",
                },
                link: {
                  bsonType: "string",
                  description: "song URI",
                },
                imageLink: {
                  bsonType: "string",
                  description: "image link",
                },
              },
            },
          },
        },
      },
    };

    if (collectionNames.includes(PLAYLIST_COLLECTION)) {
      console.log(`collection ${PLAYLIST_COLLECTION} exists`);
    } else {
      await database.createCollection(PLAYLIST_COLLECTION, {
        validator,
      });
      console.log(`collection ${PLAYLIST_COLLECTION} exists`);
    }

    // insert test data
    if (false) {

      // delete your playlists
      const playlistTestCol = database.collection(PLAYLIST_COLLECTION_TEST);
      // put your user id here
      const delRes = await playlistTestCol.deleteMany({ author: new ObjectId('64b23ae964a775d33d53d832')});
      console.log(`deleted ${delRes.deletedCount}`);

      // generate new playlists
      const docs = [];
      for (let i = 0; i < 100; i++) {
        docs.push({
          artist: 'Spotify',
          playlistID: i.toString(),
          dateCreated: new Date(),
          description: '...',
          name: 'Otonashi',
          // put your user id here
          author: new ObjectId('64b23ae964a775d33d53d832'),
          isFavorited: false,
          coverImageURL: 'https://i.scdn.co/image/ab67616d0000b27304a31825fa7261e702f17f7d',
          songs: [
            {
              songID: uuid(),
              artist: 'SHOW-GO',
              name: 'Otonashi',
              type: 'spotify',
              link: 'spotify:track:3W8gOphVnFTHFiE22pO08y',
              imageLink: 'https://i.scdn.co/image/ab67616d0000b27304a31825fa7261e702f17f7d',
              album: 'Otonashi',
              duration: 197730,
              releaseDate: '2022-08-26'
            }
          ],
          originSpotifyId: '7AtfIT67WGJMOoCfFeoqgr',
          isAlbum: true
        })

      }

      const res = await playlistTestCol.insertMany(docs);

      if (res.insertedCount) {
        console.log(`inserted ${res.insertedCount} items`);
      }
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
setupCollections().catch(console.dir);

// api
var spotifyRouter = require('./routes/spotify');
var youtubeRouter = require('./routes/youtube');
var youtubeSearchRouter = require('./routes/ytSearch');
var spotifySearchRouter = require('./routes/spSearch');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// API
app.use('/spotify', spotifyRouter);
app.use('/youtube', youtubeRouter);
app.use('/yt-search', youtubeSearchRouter);
app.use('/sp-search', spotifySearchRouter);

// login
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// search and playlists
app.use('/playlists', playlistsRouter);

module.exports = app;
