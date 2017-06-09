var config = require('../../../config')

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
