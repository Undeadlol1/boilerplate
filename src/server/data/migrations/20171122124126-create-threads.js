'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('threads', {
      id: {
        unique: true,
        primaryKey: true,
        type: Sequelize.UUID,
        validate: { isUUID: 4 },
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
          unique: true,
          allowNull: false,
          type: Sequelize.STRING,
      },
      slug: {
          unique: true,
          allowNull: false,
          type: Sequelize.STRING,
      },
      text: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      isClosed: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('threads');
  }
};