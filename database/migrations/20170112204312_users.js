
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.bigInteger('twitterId').unique();
        table.string('name');
        table.string('twitterName').unique();
        table.string('twitterProfileUrl');
        table.string('accessToken');
        table.string('accessTokenSecret');
        table.unique('accessToken');
        table.timestamp('deleted_at');
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
