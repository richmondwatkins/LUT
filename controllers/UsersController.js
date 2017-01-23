"use strict";
var UserRepository = require('../repositories/UserRepository');
var Twitter = require('../services/Twitter.js');

class UsersController {

    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    create(oauth) {
        var twitterClient = new Twitter(oauth.access_token, oauth.access_token_secret);

        twitterClient.getProfileInfo(twitterResp => {
            new UserRepository(null)
                .createOrUpdate(oauth.access_token, oauth.access_token_secret, twitterResp, userId => {
                    this.req.session.userId = userId;
                    let scope = this;
                    this.req.session.save(function(err) {
                        scope.res.redirect('/');
                    });
            });
        }, failure => {
            console.log(failure);
        });
    }

    destroy() {
        new UserRepository(/*req.session.userId*/ 1).destroy(s => {
            this.res.redirect('back');
        }, f => {

        });
    }
}

module.exports = UsersController;