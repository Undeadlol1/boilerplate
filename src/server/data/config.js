var config = process.env
var isDocker = require('is-docker')()

/*
  Sometimes application uses this config outside of webpack (migrations as an example).
  Other times webpack compiles this file in code but we try to avoid requiring json files
  manually because currently it causes endless recompiling
  To avoid this, we need to require file manually only if it's neccesery
*/
if (process.env.NODE_ENV == 'production' && config.dialect == undefined) config = require('../../../production.json')
/*
  This script will prepare database for dev/testing
  by creating databases and user if they do not exist.
  Usefull for docker containers and CI/CD pipelines.
*/
// TODO: project uses "mysql" and "mysql2" pacakges. Refactor to use only single one.
if (isDocker && (process.env.NODE_ENV == 'development' || 'test')) {
  var mysql      = require('mysql');
  var connection = mysql.createConnection({
    host     : "db",
    user     : "root",
    password : null,
    database : "boilerplate_test",
    multipleStatements: true, // multistatements query
  });
  connection.query(
    'CREATE DATABASE IF NOT EXISTS boilerplate_dev;'
    + 'CREATE DATABASE IF NOT EXISTS boilerplate_test;'
    + "CREATE USER IF NOT EXISTS 'root'@'db';"
    + "GRANT ALL PRIVILEGES ON * . * TO 'root'@'db';"
    + 'FLUSH PRIVILEGES;',
    function (error, results, fields) {
      if (error)  throw error
    }
  );
}

module.exports = {
  "development": {
    "port": "3306",
    "password": null,
    "logging": false,
    "dialect": "mysql",
    "username": "root",
    "database": "boilerplate_dev",
    // In docker containers database will have special host.
    // In non-container it will be connected through localhost.
    "host": isDocker ? "db" : "127.0.0.1",
  },
  "test": {
    "port": "3306",
    "logging": false,
    "password": null,
    "dialect": "mysql",
    "username": "root",
    "database": "boilerplate_test",
    // In docker containers database will have special host.
    // In non-container it will be connected through localhost.
    "host": isDocker ? "db" : "127.0.0.1",
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
