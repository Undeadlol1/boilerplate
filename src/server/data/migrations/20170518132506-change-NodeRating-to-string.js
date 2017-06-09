'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'nodes',
      'rating',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    )
    queryInterface.changeColumn(
      'decisions',
      'NodeRating',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'nodes',
      'rating',
      {
        type: Sequelize.DECIMAL(38, 17),
        allowNull: false,
        defaultValue: 0
      }
    )
    queryInterface.changeColumn(
      'decisions',
      'NodeRating',
      {
        type: Sequelize.DECIMAL(38, 17),
        allowNull: false,
        defaultValue: 0
      }
    )
  }
};
