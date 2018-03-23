'use strict';
module.exports = function(sequelize, DataTypes) {
  var Twitter = sequelize.define('Twitter', {
    // twitter id
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
    // TODO add checks: must not have spaces
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    username: {
      // TODO uncheck this after migration
      // TODO add UpdateOrCreate in TwitterAuth
      // allowNull: false,
      type: DataTypes.STRING,
    },
    displayName: DataTypes.STRING,
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
        // TODO test
        notContains: [' '],
      }
    },
  },
  {
    tableName: 'twitters',
    freezeTableName: true,
  });
  // Class methods
  // associations can be defined here
  Twitter.associate = function(models) {
    Twitter.belongsTo(models.User, { foreignKey: 'UserId', targetKey: 'id' })
  }
  return Twitter;
};