// Update with your config settings.
// Env variables were not being required in time unless required here
if (process.env.NODE_ENV === undefined)  require('node-env-file')(__dirname + '/../.env');

module.exports = {

  development: {
    client: process.env.DB_NODE_CONNECTION,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PG_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    seeds: {
      directory: './seeds'
    }
  },

  staging: {
    client: process.env.DB_NODE_CONNECTION,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PG_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: process.env.DB_NODE_CONNECTION,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PG_PORT,
        database: process.env.DB_DATABASE,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
