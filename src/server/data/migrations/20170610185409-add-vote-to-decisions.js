'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'decisions',
      'vote',
      {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('decisions', 'vote')
  }
};
