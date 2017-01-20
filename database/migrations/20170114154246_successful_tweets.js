
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('successful_tweets', function(table) {
        table.increments('id').primary();
        table.integer('tweet_id').unsigned().references('id').inTable('tweets');
        table.integer('user_id');
        table.bigInteger('twitterTweetId');
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
