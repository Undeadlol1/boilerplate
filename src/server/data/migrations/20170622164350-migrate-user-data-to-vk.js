'use strict';
var { User, Vk } = require('../models')
module.exports = {
  up: function(queryInterface, Sequelize) {
    // create table
    return User.findAll({
      where: {
        vk_id: {$not: null}
      }
    })
    .each(user => {
      return  Vk.create({
                UserId: user.id,
                id: user.vk_id,
              })
    })
    .catch(error => {
      console.error(error);
      throw new Error(error)
    })
  },
  down: function(queryInterface, Sequelize) {
    return
  }
};