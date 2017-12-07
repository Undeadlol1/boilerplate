'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    role: {
      allowNull: false,
      defaultValue: 'user',
      type: DataTypes.STRING,
    },
    // TODO comment
    image: DataTypes.STRING,
    /*
      NOTE: with non-latin characters the only way to avoid "charset" erros using sequelize
      was to change mysql config to accept utf-8 and changing table charsets manually via
      ALTER TABLE db_name.table_name CONVERT TO CHARACTER SET utf8;
    */
    displayName: DataTypes.STRING,
  }, {
    tableName: 'users',
    freezeTableName: true,
    classMethods: {
      // associations can be defined here
      associate: function(models) {
        User.hasOne(models.Profile)
        User.hasOne(models.Local)
        User.hasOne(models.Twitter)
        User.hasOne(models.Vk)
      }
    }
  });
  return User;
};