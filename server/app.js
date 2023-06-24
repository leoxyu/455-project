var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var spotifyRouter = require('./routes/spotify');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');

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

module.exports = app;
