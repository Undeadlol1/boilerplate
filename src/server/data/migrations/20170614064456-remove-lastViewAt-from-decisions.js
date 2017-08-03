'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('decisions', 'lastViewAt')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'decisions',
      'lastViewAt',
      {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    )
  }
};
