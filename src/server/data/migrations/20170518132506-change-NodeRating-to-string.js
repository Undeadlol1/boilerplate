'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'nodes',
      'rating',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    ).then(function() {
      return queryInterface.changeColumn(
        'decisions',
        'NodeRating',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      )
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'nodes',
      'rating',
      {
        type: Sequelize.DECIMAL(38, 17),
        allowNull: false,
        defaultValue: 0
      }
    ).then(function() {
      return queryInterface.changeColumn(
        'decisions',
        'NodeRating',
        {
          type: Sequelize.DECIMAL(38, 17),
          allowNull: false,
          defaultValue: 0
        }
      )
    })
  }
};
