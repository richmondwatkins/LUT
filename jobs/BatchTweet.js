"use strict";

var pg = require('../database/pg.js');
var moment = require('moment');
var momentTimezone = require('moment-timezone');
var Tweet = require('../models/Tweet.js');

class BatchTweet {

    start() {
        let currentHour = moment().tz('America/New_York').hour();
        console.log(`======== Collection Tweets for ${currentHour} ========`);
        this.getTweetsForHour(currentHour, resp => {
            resp.forEach(t => {
                this.send(t);
            });
        });
    }

    getTweetsForHour(hr, fn) {
        pg('tweets').select()
            .where('hour', hr)
            .then(resp => {
                if (resp) {
                    let tweets = resp.map(t => new Tweet(t));
                    fn(tweets);
                }
            });
    }

    send(tweet) {
        console.log(`======== Start From Batch ========`);
        tweet.start(completion => {

        });
    }
}

module.exports = BatchTweet;