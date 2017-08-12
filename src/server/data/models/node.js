'use strict';
module.exports = function(sequelize, DataTypes) {
  var Node = sequelize.define('Node', {
      url: {
        allowNull: false,
        type: DataTypes.STRING
      },
      provider: {
        type: DataTypes.STRING,
        unique: 'compositeIndex'
      },
      contentId: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: 'compositeIndex',
      },
      UserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      MoodId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      rating: {
        // Deciaml points allow making of rating to be unique
        // example: rating = actualNumber + "." + Date.now()
        type: DataTypes.STRING,
        allowNull: false,
        // TODO change this (and similar ones to Sequelize.NOW?)
        defaultValue: () => {
          return String(0 + '.' + Date.now() + (50 * Math.floor((Math.random() * 100) + 1)))
        }, // TODO remove multiplier in future
      },
      type: DataTypes.STRING,
  }, {
    tableName: 'nodes',
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // Node.belongsTo(models.User, { // remember the bad copypaste? 'Mood.'
        //   // onDelete: "CASCADE",
        //   foreignKey: {
        //     allowNull: false
        //   }
        // });
        // Node.belongsTo(models.Mood, { // remember the bad copypaste? 'Mood.'
        //   // onDelete: "CASCADE",
        //   foreignKey: {
        //     allowNull: false
        //   }
        // });
        Node.belongsTo(models.Mood, {foreignKey: 'MoodId', targetKey: 'id'});
        Node.hasOne(models.Decision)
        Node.hasOne(models.Rating)
      }
    }
  });
  return Node;
};