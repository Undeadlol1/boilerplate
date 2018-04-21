'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
      role: {
        allowNull: false,
        defaultValue: 'user',
        type: DataTypes.STRING,
        comment: 'User can be an "admin" or a "user"',
      },
      // TODO comment
      image: {
        type: DataTypes.STRING,
        comment: 'Link to user\'s avatar.'
      },
      /*
        NOTE: with non-latin characters the only way to avoid "charset" erros using sequelize
        was to change mysql config to accept utf-8 and changing table charsets manually via
        ALTER TABLE db_name.table_name CONVERT TO CHARACTER SET utf8;
      */
      displayName: {
        type: DataTypes.STRING,
        comment: 'Human readable name of the user. Not unique. Updatable by user.'
      },
    },
    {
      tableName: 'users',
      freezeTableName: true,
    },
  );
  // Class methods
  User.associate = function (models) {
    User.hasOne(models.Profile)
    User.hasOne(models.Local)
    User.hasOne(models.Twitter)
    User.hasOne(models.Vk)
  }
  return User;
};