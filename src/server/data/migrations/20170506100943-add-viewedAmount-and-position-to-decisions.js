'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'decisions',
      'position',
      {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.STRING,
      }
    )
    queryInterface.addColumn(
      'decisions',
      'viewedAmount',
      {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.STRING,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('decisions', 'position')
    queryInterface.removeColumn('decisions', 'viewedAmount')
  }
};
