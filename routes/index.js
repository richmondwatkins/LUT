var express = require('express');
var router = express.Router();
var TweetsController = require('../controllers/TweetsController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    new TweetsController(req, res).index()
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        res.redirect('back');
    })
});


module.exports = router;
