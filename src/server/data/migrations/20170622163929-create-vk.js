'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    // create table
    return queryInterface.createTable('vks', {
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
    return queryInterface.dropTable('vks');
  }
};