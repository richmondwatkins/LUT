
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('content_providers').del(), 

    knex('content_providers').insert({id: 1, name: 'CNN'}),
    knex('content_providers').insert({id: 2, name: 'FOX'})
  );
};
