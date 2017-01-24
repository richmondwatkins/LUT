"use strict";
var AuthController = require('./AuthController');
var TweetUserRepository = require('../repositories/TweetUserRepository.js');
var TweetRepository = require('../repositories/TweetRepository.js');
var UserRepository = require('../repositories/UserRepository.js');
var Twitter = require('../services/Twitter.js');
var Tweet = require('../models/Tweet.js');
var moment = require('moment');

class TweetsController extends AuthController {

    index() {
        new TweetRepository().get(tweets => {
            tweets.forEach(t => {
                t.goesOutAt = moment().hour(t.hour).format('h a');
            });
            if (this.isAuth()) {
                new TweetUserRepository(this.req.session.userId, tweets.map(t => t.id)).get(subedTweets => {
                    subedTweets.forEach(t => {
                        for (var i = 0; i < tweets.length; i++) {
                            if (t.id === tweets[i].id) {
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

    send() {
        let tweetId = this.req.body.tweetId;

        new TweetRepository(
            this.req.session.userId, 
            [tweetId])
        .get(dbTweet => {
            if (! dbTweet) {
                this.res.send({error:'Something went wrong. Refresh and try again.'});
                return;
            }

            let tweet = new Tweet(dbTweet[0]);

            new UserRepository(this.req.session.userId).get(user => {
                if (user) {
                    tweet.sendOne(user[0], (err, result) => {
                        this.res.send(result);
                    });
                } else {
                    this.res.error({error:'Could not find user. Refresh and Sign in'});
                }
            });
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