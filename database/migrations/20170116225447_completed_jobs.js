
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('completed_jobs', function(table) {
        table.increments('id').primary();
        table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {

};
