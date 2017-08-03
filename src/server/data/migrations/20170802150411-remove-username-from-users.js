'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return  queryInterface
      .removeColumn('users', 'username')
      .catch(() => {
        // do nothing intentionally
      })
  },

  down: function (queryInterface, Sequelize) {
    return
  }
};
