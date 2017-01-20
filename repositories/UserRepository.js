"use strict";

var pg = require('../database/pg.js');
var moment = require('moment');

class UserRepository {

    constructor(userId) {
        this.userId = userId;
    }

    createOrUpdate(accessToken, accessTokenSecret, twitterProfileResponse, fn) {
        console.log(twitterProfileResponse);
        this.accessToken = accessToken;
        this.accessTokenSecret = accessTokenSecret;
        this.twitterProfileResponse = twitterProfileResponse;

        let now = moment();
        var insert = {
            accessToken: this.accessToken, 
            accessTokenSecret: this.accessTokenSecret,
            created_at: now,
            updated_at: now,
        };

        if ('id' in this.twitterProfileResponse) {
            insert.twitterId = this.twitterProfileResponse['id'];
        }

        if ('screen_name' in this.twitterProfileResponse) {
            insert.twitterName = this.twitterProfileResponse['screen_name'];
        }

        if ('name' in this.twitterProfileResponse) {
            insert.name = this.twitterProfileResponse['name'];
        }

        if ('url' in this.twitterProfileResponse) {
            insert.twitterProfileUrl = this.twitterProfileResponse['url'];
        }

        var scope = this;

        pg('users').select('id')
            .where('accessToken', this.accessToken)
            .orWhere('twitterId', insert.twitterId)
            .then(ids => {
                if (ids[0] && ids[0]['id']) {
                    scope.update(ids[0]['id'], insert, fn);
                } else {
                    scope.create(insert, fn)
                }
            });
    }

    get() {

    }

    destroy(success, failure) {
       pg('users')
            .where('id', this.userId)
            .update({deleted_at: moment()})
            .then(function() {
                success();
            }).catch(err => {
                console.log(err);
            });
    }

    create(info, fn) {
        pg('users')
            .returning('id')
            .insert(info)
            .then(function(id) {
                fn(id);
        }).catch(err => {
            console.log(err);
        });
    }

    update(id, info, fn) {
        info.updated_at = moment();

        pg('users')
            .where('id', id)
            .update(info)
            .then(function(id) {
                fn(id);
        });
    }
}

module.exports = UserRepository;