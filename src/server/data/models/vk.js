'use strict';
module.exports = function(sequelize, DataTypes) {
  var Vk = sequelize.define('Vk', {
    // Vk id
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
      // TODO add UpdateOrCreate in VkAuth
      // allowNull: false,
      type: DataTypes.STRING,
    },
    displayName: {
      type: DataTypes.STRING,
      charset: 'utf8',
      collate: 'utf8_unicode_ci',
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
        // TODO test
        notContains: [' '],
      }
    },
  }, {
    tableName: 'vks',
    freezeTableName: true,
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Vk.belongsTo(models.User, {foreignKey: 'UserId', targetKey: 'id'})
      }
    }
  });
  return Vk;
};