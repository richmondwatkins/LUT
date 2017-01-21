"use strict";

var pg = require('../database/pg.js');
var moment = require('moment');

class ErrorTweet {

    /*
       //statusCode: 400,
    //data: '{"errors":[{"code":215,"message":"Bad Authentication data."}]}' } } 
    */
    constructor(tweetId, tweetResult) {
        console.log(tweetResult);

        this.tweet_id = tweetId;
        this.user_id = tweetResult.user.user_id;
        this.httpCode = tweetResult.error.statusCode;

        if (tweetResult.error.data) {
            let errorData = JSON.parse(tweetResult.error.data);

            this.errorCode = errorData.errors[0].code;
            this.message = errorData.errors[0].message; 
        }
        
        let now = moment();

        this.created_at = now;
        this.updated_at = now;
    }

    static saveBatch(errorTweets, fn) {
        pg.batchInsert('error_tweets', errorTweets).then(function() {
            fn();
        });
    }
}

module.exports = ErrorTweet;