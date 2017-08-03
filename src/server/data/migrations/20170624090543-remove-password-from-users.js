'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('users', 'password')
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('users', 'password', Sequelize.STRING)
  }
};
