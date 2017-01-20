"use strict";

var pg = require('../database/pg.js');
var moment = require('moment');

class SentTweet {

    constructor(tweetId, tweetResult) {
        let twitterJSON = JSON.parse(tweetResult.success);

         this.user_id = tweetResult.user.user_id;
         this.tweet_id = tweetId;
         this.twitterTweetId = twitterJSON.id;

         let now = moment();

         this.created_at = now;
         this.updated_at = now;
    }

    static saveBatch(sucessfulTweets, fn) {
        pg.batchInsert('successful_tweets', sucessfulTweets)
            .returning('id')
            .then(function(id) {
                fn();
        });
    }
}

module.exports = SentTweet;