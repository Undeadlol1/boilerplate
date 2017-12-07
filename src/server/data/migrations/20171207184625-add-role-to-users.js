'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return  queryInterface.addColumn(
      'users',
      'role',
      {
        allowNull: false,
        defaultValue: 'user',
        type: Sequelize.STRING,
      }
  )
  },

  down: function (queryInterface, Sequelize) {
    return  queryInterface.removeColumn('users', 'role')
  }
};
