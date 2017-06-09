'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'decisions',
      'lastViewAt',
      {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('decisions', 'lastViewAt')
  }
};
