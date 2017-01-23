"use strict";

var pg = require('../database/pg.js');
var moment = require('moment');
var request = require('request');
var Twitter = require('../services/Twitter.js');
var Error = require('./Error.js');
var TweetResult = require('./TweetResult.js');
var SentTweet = require('./SentTweet.js');
var ErrorTweet = require('./ErrorTweet.js');
var async = require('async');

var LIMIT = 30;

class Tweet {

    constructor(databaseEntry) {
        this.id = databaseEntry['id'];
        this.sendHour = databaseEntry['hour'];
        this.userId = databaseEntry['user_id'];
        this.hashTags = JSON.parse(databaseEntry['lastHashTags']);

        let altTimeStamp = moment(databaseEntry['lastAltTextTime']);
        let origTimeStamp = moment(databaseEntry['lastOriginalTextTime']);

        this.isAlt = altTimeStamp.isBefore(origTimeStamp);

        // if (this.isAlt) {
        //     this.text = databaseEntry['altText'];
        // } else {
            this.text = databaseEntry['text'];
            this.hashTags = this.hashTags.reverse();
        // }
    }

    start(fn) {
        this.completion = fn;
        this.tweetText = this.buildTweetText();

        this.getUserCount((r, e) => {
            if (! e) {
                this.userCount = parseInt(r);
                this.startSendQueue(0);
            }
        });
    }

    buildTweetText() {
        var hashTagText = '';
        this.hashTags.forEach(t => {
            hashTagText += ` #${t}`;
        });
        return `${this.text}${hashTagText}`
    }

    getUserCount(fn) {
        pg('users_tweets')
            .count()
            .where('users_tweets.tweet_id', this.id)
            .join('users', 'users_tweets.user_id', 'users.id')
            .then(resp => {
                if (resp[0]) {
                     fn(resp[0].count, null);
                } else {
                    fn(null, new Error('could not get count'));
                }
            })
            .catch(function(error) {
                // If we get here, that means that neither the 'Old Books' catalogues insert,
                // nor any of the books inserts will have taken place.
                fn(null, error);
            });
    }

    getUsers(offset, fn) {
        if (offset > this.userCount) {
            fn('done');
            return;
        }

        pg('users_tweets').select('*')
            .where('users_tweets.tweet_id', this.id)
            .join('users', 'users_tweets.user_id', 'users.id')
            .whereNull('users.deleted_at')
            .orderBy('users_tweets.id')
            .limit(LIMIT)
            .offset(offset)
            .then(resp => {
                if (resp) {
                    fn(resp);
                }
            });
    }

    startSendQueue(offset) {
        let scope = this;
        this.getUsers(offset, users => {
            if (users === 'done') {
                console.log(`======== all users processed for tweet ${this.id} ========`);
                scope.finish()
                return; 
            }

            let requests = users.map(u => {
                return this.buildRequest(u);
            });

           if (requests.length) {
                async.parallelLimit(requests, 15, function(err, results) {
                    scope.saveResult(results, c => {
                        console.log('======== Start Next Batch ========');
                        scope.startSendQueue(offset + LIMIT);
                    });
                });
            }  else {
                scope.finish();
            }
        });
    }
    buildRequest(user) {
        let scope = this;

        return function(callback) {
            let twitterClient = new Twitter(user.accessToken, user.accessTokenSecret);
            let result = new TweetResult();
            result.user = user;

            var didCallCompletion = false;

            setTimeout(function() {
                if (! didCallCompletion) {
                    didCallCompletion = true;
                    console.log('======== timeout reached ========');
                    result.error = { 
                        statusCode: 900, 
                        data: '{"errors":[{"code":99,"message":"JS Timeout Called"}]}' 
                    };
                    callback(null, result);
                }
            }, 10000);
            console.log('======== posting tweet ========');
            twitterClient.postTweet(scope.tweetText, s => {
                console.log('======== posting success ========');
                result.success = s;
                if (! didCallCompletion) {
                    didCallCompletion = true;
                    callback(null, result);
                }
            }, f => {
                console.log('======== posting failure ========');
                result.error = f;

                if (! didCallCompletion) {
                    didCallCompletion = true;
                    callback(null, result);
                }
            });
        }
    }

    //statusCode: 403,
    //data: '{"errors":[{"code":187,"message":"Status is a duplicate."}]}

    //statusCode: 401,
    //data: '{"errors":[{"code":32,"message":"Could not authenticate you."}]}' }

    //statusCode: 400,
    //data: '{"errors":[{"code":215,"message":"Bad Authentication data."}]}' } } 
    saveResult(results, fn) {
        var successes = [];
        var errors = [];

        results.forEach(r => {
            if (r.success) {
                successes.push(new SentTweet(this.id, r));
            } else if (r.error) {
                //TODO: figure out how to handle errors. Saving them for now
                errors.push(new ErrorTweet(this.id, r));
            }
        });

        SentTweet.saveBatch(successes, function() {
            ErrorTweet.saveBatch(errors, fn);
        });
    }

    finish() {
        let insert = {
            lastHashTags: JSON.stringify(this.hashTags),
            updated_at: moment()
        };

        // if (this.isAlt) {
        //     insert.lastAltTextTime = moment();
        // } else {
            insert.lastOriginalTextTime = moment();
        // }

        pg('tweets')
            .update(insert)
            .where('id', this.id)
            .then(function() {
                console.log(' ========= FINISH BATCH ========= ');
        });
    }
}

module.exports = Tweet;