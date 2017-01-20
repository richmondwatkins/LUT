
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('hashtags', function(table) {
        table.increments('id').primary();
        table.integer('tweet_id').unsigned().references('id').inTable('tweets');
        table.string('tag');
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
