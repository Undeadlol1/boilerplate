'use strict';
module.exports = function(sequelize, DataTypes) {
  var Forums = sequelize.define('Forums', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
      comment: 'Unique identifier.',
    },
    name: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
      comment: 'Human redable name for a forum.',
    },
    slug: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        comment: 'Url friendly name of a forum.',
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'Unique id of a user who created this forum.',
    },
  },
  {
    tableName: 'forums',
    freezeTableName: true,
  })
  // Class methods
  // associations can be defined here
  Forums.associate = function(models) {
    Forums.belongsTo(models.User)
  }
  return Forums;
};