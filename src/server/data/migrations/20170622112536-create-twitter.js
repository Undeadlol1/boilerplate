'use strict';
var { User, Local, Profile } = require('../models')
module.exports = {
  up: function(queryInterface, Sequelize) {
    // create table
    return queryInterface.createTable('twitters', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      username: Sequelize.STRING,
      image: Sequelize.STRING,
      displayName: Sequelize.STRING,
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('twitters');
  }
};