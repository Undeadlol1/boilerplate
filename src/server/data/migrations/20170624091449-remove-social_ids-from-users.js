'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return  queryInterface.removeColumn('users', 'facebook_id')
            .then(() => queryInterface.removeColumn('users', 'vk_id'))
            .then(() => queryInterface.removeColumn('users', 'twitter_id'))
  },

  down: function (queryInterface, Sequelize) {
    return  queryInterface.addColumn('users', 'facebook_id', Sequelize.STRING)
            .then(() => queryInterface.addColumn('users', 'vk_id', Sequelize.STRING))
            .then(() => queryInterface.addColumn('users', 'twitter_id', Sequelize.STRING))
  }
};
