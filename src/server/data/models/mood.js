'use strict';
module.exports = function(sequelize, DataTypes) {
  var Mood = sequelize.define('Mood', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    rating: {
      allowNull: null,
      defaultValue: 0,
      type: DataTypes.STRING,
    },
  }, {
    classMethods: {
      tableName: 'moods',
      freezeTableName: true,
      associate: function(models) {
        Mood.belongsTo(models.User, {
          // onDelete: "CASCADE", // TODO implement this?
          foreignKey: {
            allowNull: false
          }
        });
        Mood.hasMany(models.Node)
      },
      findIdBySlug: function(slug) {
        return Mood
                .findOne({ where: { slug } })
                .then(mood => mood && mood.get('id'))
      }
    }
  });
  return Mood;
};