"use strict";
if (process.env.NODE_ENV === undefined) require('node-env-file')(__dirname + '/.env');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var Scheduler = require('./Scheduler');
var index = require('./routes/index');
var auth = require('./routes/auth');
var users = require('./routes/users');
var tweets = require('./routes/tweets');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let sessionObj = session({
  secret: 'boo',
  resave: false,
  saveUninitialized: false
})
  
if (process.env.NODE_ENV) {
  sessionObj.store = new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });
}

app.use(sessionObj);

if (process.env.WORKER_ENV === undefined) {
  app.use('/css', express.static(__dirname + '/node_modules/bulma/css'));
  app.use('/', index);
  app.use('/auth', auth);
  app.use('/users', users);
  app.use('/tweets', tweets);
} else {
  new Scheduler().start();
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
