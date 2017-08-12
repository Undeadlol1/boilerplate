'use strict';

var { Node, Mood } = require('../models')

module.exports = {
  up: function (queryInterface, Sequelize) {
    /**
     * 1) create column
     * 2) grab each mood
     * 3) grad each node for mood and count total rating
     * 4) add this rating to mood
     */
    try {
        return queryInterface.addColumn(
          'moods',
          'rating',
          {
            allowNull: null,
            defaultValue: 0,
            type: Sequelize.STRING,
          }
        ).then(() => {
          return Mood
            .findAll({where: {}})
            .each(mood => {
              return Node.sum(
                'rating',
                {
                  where: {MoodId: mood.id}
                }
              ).then(rating => {
                return Mood.update(
                  { rating },
                  {
                    where: {
                      id: mood.id
                    }
                  }
                )
              })
            })
        })
    } catch (error) {
      console.error(error);
    }
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('moods', 'rating')
  }
};
