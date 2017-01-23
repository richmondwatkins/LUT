"use strict"; 

var express = require('express');
var router = express.Router();
var Twitter = require('../services/Twitter.js');
var UsersController = require('../controllers/UsersController.js');

router.get('/twitter/oauth', function(req, res, next) {
    let twitter = new Twitter();
    twitter.setCallBack(req.headers.referer);

    twitter.getOAuthRequestToken(oauth => {
        if (! oauth) {
            res.redirect('/');
        } else {
            req.session.oauth = oauth;

            req.session.save(function(err) {
                res.redirect('https://api.twitter.com/oauth/authenticate?oauth_token=' + oauth.token);
            })
        }
    });
});

router.get('/twitter/return', function(req, res, next) {
    req.session.oauth.oauth_verifier = req.query.oauth_verifier;

    new Twitter().getOAuthAccessToken(req, req.session.oauth, (oauth, error) => {
        new UsersController(req, res).create(oauth);
    });
});

module.exports = router;