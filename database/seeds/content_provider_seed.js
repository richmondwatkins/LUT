
exports.seed = function(knex, Promise) {
    var faker = require('faker');
    var users = [];

    for (var i = 0; i < 1000; i++) {
        users.push({
            twitterId: faker.random.number({min:1111111111, max:9999999999}),
            name: faker.name.firstName(),
            twitterName: faker.internet.userName(),
            accessToken: faker.internet.password(32),
            accessTokenSecret: faker.internet.password(32),
            created_at: faker.date.between('2016-01-01', '2017-12-31'),
            updated_at: faker.date.between('2016-01-01', '2017-12-31')
        });
    }


  return Promise.join(
    knex('users').insert(users)
  );
};
