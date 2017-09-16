'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return  queryInterface.addColumn('users', 'displayName', Sequelize.STRING)
  },

  down: function (queryInterface, Sequelize) {
    return  queryInterface.removeColumn('users', 'displayName')
  }
};
