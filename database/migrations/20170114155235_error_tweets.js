
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('error_tweets', function(table) {
        table.increments('id').primary();
        table.integer('tweet_id').unsigned().references('id').inTable('tweets');
        table.integer('user_id');
        table.integer('httpCode');
        table.integer('errorCode');
        table.string('message');
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
