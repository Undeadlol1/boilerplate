'use strict';
// THIS IS MESSED UP
// TODO fix ASAP
function colums(DataTypes) {
  var types = {
    rating: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER
    },
    position: {
      defaultValue: 0, // TODO what about this?
      allowNull: false,// TODO and this?
      type: DataTypes.INTEGER,
    },
    viewedAmount: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    nextViewAt: DataTypes.DATE,
    NodeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // unique: 'compositeIndex'
    },
    NodeRating: {
      defaultValue: 0,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // unique: 'compositeIndex'
    },
    MoodId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      // unique: 'compositeIndex'
    },
    vote: {
      allowNull: true,
      type: DataTypes.BOOLEAN
    }
  }
  if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == undefined) {
    /* somehow even after dropping 'lastViewAt' in migration,
      Sequelize does not remove the column.
      This code is kept to avoid 'does not have default value' error
    */
    // types.lastViewAt = {
    //   allowNull: false,
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // }
  }
  return types
}

module.exports = function(sequelize, DataTypes) {
  var Decision = sequelize.define(
    'Decision', // model name
    colums(DataTypes), // column types
    { // options
      tableName: 'decisions',
      freezeTableName: true,
    }
  );
  // Class methods
  Decision.associate = function(models) {
    // associations can be defined here
    Decision.belongsTo(models.Node, { foreignKey: 'NodeId', targetKey: 'id' });
    Decision.belongsTo(models.User, { foreignKey: 'UserId', targetKey: 'id' });
    // Decision.hasOne(models.Node)
  }
  return Decision;
};