var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var playlistsRouter = require('./routes/playlists');

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
