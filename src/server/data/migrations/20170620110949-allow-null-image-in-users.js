'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
            'users',
            'image',
            {
              type: Sequelize.STRING,
              allowNull: true,
            }
          )
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
            'users',
            'image',
            {
              type: Sequelize.STRING,
              allowNull: true,
            }
          )

  }
};
