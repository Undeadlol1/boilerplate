'use strict';

var { Node } = require('../models')

module.exports = {
  up: function (queryInterface, Sequelize) {
    // destroy nodes with contentId == null, to avoid errors
    return Node.destroy({
      where: {contentId: null},
    })
    // make actual migration
    .then(function() {
      return queryInterface.changeColumn(
        'nodes',
        'contentId',
        {
          allowNull: false,
          type: Sequelize.STRING,
          unique: 'compositeIndex',
        }
      )
    })
    .catch(error => {
      throw error
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'nodes',
      'contentId',
      {
        allowNull: true,
        type: Sequelize.STRING,
        unique: 'compositeIndex',
      }
    )
    .catch(function(error) {
      console.error(error);
      throw error
    })
  }
};
