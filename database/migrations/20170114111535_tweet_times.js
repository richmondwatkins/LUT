
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tweet_times', function(table) {
        table.increments('id').primary();
        table.integer('tweet_id').unsigned().references('id').inTable('tweets');
        table.integer('hour');
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
