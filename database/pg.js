'use strict';

var knex = require('knex'),
    config = require('./knexfile.js')

module.exports = knex(config.development);