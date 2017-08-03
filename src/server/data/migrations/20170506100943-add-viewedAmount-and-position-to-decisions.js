'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'decisions',
      'position',
      {
        defaultValue: 0,
        allowNull: false,
        type: Sequelize.STRING,
      }
    ).then(function() {
      return queryInterface.addColumn(
        'decisions',
        'viewedAmount',
        {
          defaultValue: 0,
          allowNull: false,
          type: Sequelize.STRING,
        }
      )
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('decisions', 'position')
            .then(function() {
              return queryInterface.removeColumn('decisions', 'viewedAmount')
            })
  }
};
