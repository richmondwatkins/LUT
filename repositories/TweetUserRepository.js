"use strict";

var pg = require('../database/pg.js');
var moment = require('moment');
var UserRepository = require('./UserRepository.js');
var TweetRepository = require('./TweetRepository.js');

class TweetUserRepository {

    constructor(userId, tweetIds) {
        console.log('============');
        console.log(userId);
        this.userId = userId;
        this.tweetIds = tweetIds;
    }

    get(fn) {
        pg('users_tweets').select()
            .where('user_id', this.userId)
            .then(tweets => {
                new TweetRepository(tweets.map(r => r.tweet_id))
                    .get(fn);
            });
    }

    createOrUpdate(fn) {
        this.create(fn);
    }

    create(fn) {
       var insert = [];
       let now = moment();

       this.tweetIds.forEach(t => {
            insert.push({
                'user_id': this.userId,
                'tweet_id': t,
                'created_at': now,
                'updated_at': now
            });
       });

       pg.batchInsert('users_tweets', insert)
            .returning('id')
            .then(function(id) {
                fn();
        });
    }

    update(fn) {
        let scope = this;
        pg('users_tweets')
            .where('user_id', this.userId)
            .del()
        .then(function() {
            scope.create(fn);
        });
    }

    destroy(fn) {
        console.log(this.tweetIds);
        let scope = this;
        pg('users_tweets')
            .where('user_id', this.userId)
            .whereIn('tweet_id', this.tweetIds)
            .del()
        .then(function() {
            fn();
        });
    }
}

module.exports = TweetUserRepository;