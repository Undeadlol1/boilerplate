'use strict';
module.exports = function(sequelize, DataTypes) {
  var Votes = sequelize.define('Votes', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
    },
    value: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    parentId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      tableName: 'votes',
      freezeTableName: true,
      associate: function(models) {
        Votes.belongsTo(models.User, {
          foreignKey: {allowNull: false}
        });
      },
    }
  });
  return Votes;
};