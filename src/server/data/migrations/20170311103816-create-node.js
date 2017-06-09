'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('nodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      url: {
        allowNull: false,
        type: Sequelize.STRING
      },
      contentId: {
        type: Sequelize.STRING,
        unique: 'compositeIndex'
      },
      provider: {
        type: Sequelize.STRING,
        unique: 'compositeIndex'        
      },
      type: Sequelize.STRING,
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      UserId: {
        type: Sequelize.STRING,
        allowNull: false,
        // references: {
        //   model: 'users',
        //   key: 'id'
        // }
      },
      MoodId: {
        type: Sequelize.STRING,
        allowNull: false,
        // references: {
        //   model: 'moods',
        //   key: 'id'
        // }
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
    return queryInterface.dropTable('nodes');
  }
};