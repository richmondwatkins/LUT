"use strict";
var AuthController = require('./AuthController');
var TweetUserRepository = require('../repositories/TweetUserRepository.js');
var TweetRepository = require('../repositories/TweetRepository.js');

class TweetsController extends AuthController {

    index() {
        new TweetRepository().get(tweets => {
            // this.res.send(tweets);
            this.res.render('index', { oauthSession: true, tweets: tweets});
        });
    }

    create() {
        new TweetUserRepository(
            this.req.session.userId, 
            this.req.body.tweetIds)
        .createOrUpdate(callback => {
            this.res.redirect('back');
        });
    }

    suggest() {
        TweetRepository.suggest(
            this.req.session.userId, 
            this.req.body.message, 
            callback => {
                this.res.redirect('back');
        });
    }

    destroy() {
        new TweetUserRepository(
            this.req.session.userId, 
            this.req.body.tweetIds)
        .destroy(callback => {
            this.res.redirect('back');
        });
    }
}

module.exports = TweetsController;