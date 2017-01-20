 
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('suggested_tweets', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users');;
        table.string('message');
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
