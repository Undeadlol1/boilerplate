'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comments = sequelize.define('Comments', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    parentId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  }, {
      tableName: 'comments',
      freezeTableName: true,
  });
  // Class methods
  Comments.associate = function(models) {
    Comments.belongsTo(models.User, {
      foreignKey: { allowNull: false }
    });
    // TODO
    // Comments.hasMany(models.Revisions)
  }
  // TODO do we need this?
  Comments.findIdBySlug = function(slug) {
    return Comments
      .findOne({ where: { slug } })
      .then(skill => skill && skill.get('id'))
  }
  return Comments;
};