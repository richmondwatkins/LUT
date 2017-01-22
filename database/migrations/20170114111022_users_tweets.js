
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users_tweets', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNull().references('id').inTable('users');
        table.integer('tweet_id').unsigned().notNull().references('id').inTable('tweets');
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
