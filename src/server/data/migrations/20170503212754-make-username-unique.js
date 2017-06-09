'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'users',
      'username',
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
    )
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'users',
      'username',
      {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false
      }
    )
  }
};
