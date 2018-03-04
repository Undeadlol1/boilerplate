'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('decisions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rating: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      NodeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      NodeRating: {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        // references: {
        //   model: 'users',
        //   key: 'id'
        // }
      },
      MoodId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      nextViewAt: Sequelize.DATE,
      lastViewAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('decisions');
  }
};