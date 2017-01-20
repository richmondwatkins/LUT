"use strict";

var cron = require('node-cron');
var BatchTweet = require('./jobs/BatchTweet.js');
var pg = require('./database/pg.js');
var moment = require('moment');

//0 0 * * * *
cron.schedule("0 0 * * * *", function(){
    new BatchTweet().start();

    let now = moment();

    pg('completed_jobs')
            .insert({
                created_at: now,
                updated_at: now
            })
        .then(function() {

        }).catch(err => {
            console.log(err);
        });
}); 
