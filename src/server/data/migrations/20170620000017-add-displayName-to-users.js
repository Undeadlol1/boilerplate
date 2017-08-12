'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    // doing nothing intentionally
    return
    // return  queryInterface.addColumn('users', 'displayName', Sequelize.STRING)
  },

  down: function (queryInterface, Sequelize) {
    // doing nothing intentionally
    return
    // return  queryInterface.removeColumn('users', 'displayName')
  }
};
