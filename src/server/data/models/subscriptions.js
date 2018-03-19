'use strict';
module.exports = function(sequelize, DataTypes) {
  var Subscriptions = sequelize.define('Subscriptions', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
    },
    // you can subscribe to something in diffrente ways
    // (exmp: subscribe to classroom as teacher, student or a parent)
    type: {
        type: DataTypes.STRING,
    },
    parentId: {
      allowNull: false,
      // move to UUID in future
      type: DataTypes.STRING
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    tableName: 'subscriptions',
    freezeTableName: true,
  });
  // Class methods
  Subscriptions.associate = function(models) {
    // subs belong to usr
    Subscriptions.belongsTo(models.User, {
      foreignKey: { allowNull: false }
    })
  }
  return Subscriptions;
};
