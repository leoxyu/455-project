var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const { DATABASE_NAME, PLAYLIST_COLLECTION } = require('./shared/mongoConstants');

var indexRouter = require('./routes/index');
var spotifyRouter = require('./routes/spotify');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var playlistsRouter = require('./routes/playlists');

const { MongoClient } = require("mongodb");
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

async function setupCollections() {
  try {
    const database = client.db(DATABASE_NAME);
    const collections = await database.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (collectionNames.includes(PLAYLIST_COLLECTION)) {
      console.log(`collection ${PLAYLIST_COLLECTION} exists`);
      return;
    };

    const validator = {
      $jsonSchema: {
        bsonType: "object",
        required: ["name", "dateCreated", "description", "author", "isFavorited", "coverImageURL", "songs"],
        properties: {
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
            description: "ID of the object's author",
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
              required: ["artist", "name", "type", "link"],
              properties: {
                artist: {
                  bsonType: "string",
                  description: "Name of the artist",
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
              },
            },
          },
        },
      },
    };
    
    await database.createCollection(PLAYLIST_COLLECTION, {
      validator,
    });
    console.log(`collection ${PLAYLIST_COLLECTION} exists`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
setupCollections().catch(console.dir);

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

// login
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// search and playlists
app.use('/playlists', playlistsRouter);

module.exports = app;
