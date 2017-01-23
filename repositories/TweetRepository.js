"use strict";

var pg = require('../database/pg.js');
var moment = require('moment');

class TweetRepository {

    constructor(tweetIds) {
        this.tweetIds = tweetIds;
    }

    get(fn) {
        var select = pg('tweets').select();

        if (this.tweetIds) {
            select = select.whereIn('id', this.tweetIds)
        }
        
        select
            .orderBy('hour')
            .then(tweets => {
                fn(tweets.map(t => {
                    t.hashTags = JSON.parse(t.lastHashTags);
                    t.fullText = t.text;
                    return t;
                }));
            });
    }

    static suggest(userId, message, fn) {
        let now = moment();

        pg('suggested_tweets')
            .returning('id')
            .insert({
                user_id: userId, 
                message: message,
                created_at: now,
                updated_at: now
            })
            .then(function() {
                fn();
        }).catch(err => {
            console.log(err);
        });
    }
}

module.exports = TweetRepository;