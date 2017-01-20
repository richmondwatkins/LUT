
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('tweets', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users');;
        table.string('text');
        table.string('altText');
        table.string('lastHashTags');
        table.timestamp('lastOriginalTextTime');
        table.timestamp('lastAltTextTime');
        table.integer('hour')
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
