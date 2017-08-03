'use strict';
var { User, Twitter } = require('../models')
module.exports = {
  up: function(queryInterface, Sequelize) {
    // create table
    return User.findAll({
      where: {
        twitter_id: {$not: null}
      }
    })
    .each(user => {
      return  Twitter.create({
                UserId: user.id,
                id: user.twitter_id,
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