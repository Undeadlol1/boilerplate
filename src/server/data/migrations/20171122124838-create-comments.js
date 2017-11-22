'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('comments', {
      id: {
        unique: true,
        primaryKey: true,
        type: Sequelize.UUID,
        validate: { isUUID: 4 },
        defaultValue: Sequelize.UUIDV4,
      },
      text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      parentId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('comments');
  }
};