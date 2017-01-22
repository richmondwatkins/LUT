"use strict";
var AuthController = require('./AuthController');
var TweetUserRepository = require('../repositories/TweetUserRepository.js');
var TweetRepository = require('../repositories/TweetRepository.js');

class TweetsController extends AuthController {

    index() {
        new TweetRepository().get(tweets => {
            if (this.isAuth()) {
                new TweetUserRepository(this.req.session.userId, tweets.map(t => t.id)).get(subedTweets => {
                    subedTweets.forEach(t => {
                        for (var i = 0; i < tweets.length; i++) {
                            if (t.id === tweets[i].id) {
                                console.log('hit');
                                tweets[i].isSubbed = true;
                                break;
                            }
                        }
                    });
                    this.res.render('index', { oauthSession: this.isAuth(), tweets: tweets});
                });
            } else {
                this.res.render('index', { oauthSession: this.isAuth(), tweets: tweets});
            }
        });
    }

    create() {
        new TweetUserRepository(
            this.req.session.userId, 
            [this.req.body['tweetIds[]']])
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
            [this.req.body['tweetIds[]']])
        .destroy(callback => {
            this.res.send();
           // this.res.redirect('back');
        });
    }
}

module.exports = TweetsController;