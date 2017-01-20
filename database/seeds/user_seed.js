
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('users').del(), 

    knex('users').insert({authToken: 'authToken', authSecret: 'authSecret'})
  );
};
