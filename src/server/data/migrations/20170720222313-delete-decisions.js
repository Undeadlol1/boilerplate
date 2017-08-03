'use strict';
var { Decision } = require('../models')

module.exports = {
  up: function (queryInterface, Sequelize) {
    return Decision.destroy({where: {}})
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
