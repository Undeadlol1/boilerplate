var config = process.env

/*
  Sometimes application uses this config outside of webpack
    (migrations as an example).
  Other times webpack compiles this file in code but we try to avoid requiring json files
    manually because currently it causes endless recompiling
  To avoid this, we need to require file manually only if it's neccesery
*/
if (process.env.NODE_ENV == 'production' && config.dialect == undefined) config = require('../../../production.json')

module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "mood_test", // "database_test", TODO bring this back
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false
  },
  "production": {
    "username": config.DB_USER,
    "password": config.DB_PASS,
    "database": config.DB_NAME,
    "host": config.DB_HOST,
    "port": config.DB_PORT,
    "dialect": config.DB_DIALECT,
    "logging": false
  }
}
