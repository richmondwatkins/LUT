"use strict"; 
var OAuth = require('oauth').OAuth;
if (process.env.NODE_ENV === undefined) require('node-env-file')(__dirname + '/../.env');

class Twitter {
    constructor(accessToken, accessTokenSecret) {
        this.accessToken = accessToken;
        this.accessTokenSecret = accessTokenSecret;
        this.sharedInit();
    }

    setCallBack(domain) {
        this.sharedInit(domain + process.env.TWITTER_CALLBACK);
    }

    sharedInit(callBackUrl) {
        this.consumerKey = process.env.TWITTER_CONSUMER_KEY;
        this.consumerSecret = process.env.TWITTER_SECRET_KEY;
        this.callBackUrl = callBackUrl ? callBackUrl : process.env.TWITTER_CALLBACK;
        this.baseUrl = 'https://api.twitter.com/1.1';

        this.oauth = new OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            this.consumerKey,
            this.consumerSecret,
            '1.0',
            this.callBackUrl,
            'HMAC-SHA1'
        );
    }

    getOAuthRequestToken(next) {
        this.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
            if (error) {
                console.log(error);
                next();
            }
            else {
                var oauth = {};
                oauth.token = oauth_token;
                oauth.token_secret = oauth_token_secret;
                next(oauth);
            }
        });
    }


    getOAuthAccessToken(req, oauth, next) {
        if (req.session.oauth) {
            req.session.oauth.verifier = req.query.oauth_verifier;
            var oauth_data = req.session.oauth;
         
            this.oauth.getOAuthAccessToken(
                oauth_data.token,
                oauth_data.token_secret,
                oauth_data.verifier,
                function(error, oauth_access_token, oauth_access_token_secret, results) {
                    if (error) {
                        next(null, error);
                    } else {
                        req.session.oauth.access_token = oauth_access_token;
                        req.session.oauth.access_token_secret = oauth_access_token_secret;

                        next(req.session.oauth, null);                        
                      // res.redirect('/'); // You might actually want to redirect!
                    }
                }
            );
        } else {
            res.redirect('/login'); // Redirect to login page
        }
    }

    //https://api.twitter.com/1.1/account/verify_credentials.json
    getProfileInfo(success, failure) {
        this.doRequest(this.baseUrl + '/account/verify_credentials.json', success, failure);
    }

    postTweet(text, success, failure) {
        this.doPost(this.baseUrl + '/statuses/update.json', {status: text}, success, failure);
    }

    doPost(url, post_body, success, error) {
        // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
        // From https://github.com/ttezel/twit/blob/master/lib/oarequest.js
        url = this.encodeUrl(url);

        //(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback 
        this.oauth.post(url, this.accessToken, this.accessTokenSecret, post_body, "application/x-www-form-urlencoded", function (err, body, response) {
            console.log('URL [%s]', url);

            if (!err && response.statusCode == 200) {
                success(body);
            } else {
                error(err, response, body);
            }
        });
    }

    doRequest(url, success, error) {
        url = this.encodeUrl(url);
        this.oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json', this.accessToken, this.accessTokenSecret, function (err, body, response) {
            if (!err && response.statusCode == 200) {
                let limits = {
                    "x-rate-limit-limit": response.headers['x-rate-limit-limit'],
                    "x-rate-limit-remaining": response.headers['x-rate-limit-remaining'],
                    "x-rate-limit-reset": response.headers['x-rate-limit-reset'],
                };
                success(JSON.parse(body), limits);
            } else {
                error(err, response, body);
            }
        });
    }

    encodeUrl(url) {
        return url.replace(/\!/g, "%21")
            .replace(/\'/g, "%27")
            .replace(/\(/g, "%28")
            .replace(/\)/g, "%29")
            .replace(/\*/g, "%2A");
    }
}

module.exports = Twitter;
