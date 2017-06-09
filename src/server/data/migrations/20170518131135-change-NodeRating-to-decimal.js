'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'decisions',
      'NodeRating',
      {
        type: Sequelize.DECIMAL(38, 17),
        allowNull: false,
        defaultValue: 0
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'decisions',
      'NodeRating',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      }
    )
  }
};
