var express = require('express');
var router = express.Router();
var TweetsController = require('../controllers/TweetsController.js');

router.get('/', function(req, res, next) {
  new TweetsController(req, res).index();
});

router.post('/suggest', function(req, res, next) {
  new TweetsController(req, res).suggest();
});

router.post('/subscribe', function(req, res, next) {
  new TweetsController(req, res).create();
});

router.delete('/subscribe', function(req, res, next) {
  new TweetsController(req, res).destroy();
});


module.exports = router;
