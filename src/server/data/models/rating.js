'use strict';
module.exports = function(sequelize, DataTypes) {
  // add vote (allow null: true)
  // add ratings model
  var Rating = sequelize.define('Rating', {
    value: {
      // TODO move this into single function (or use sequelize.now?)
      defaultValue: () => {
        return String(0 + '.' + Date.now() + (50 * Math.floor((Math.random() * 100) + 1)))
      }, // TODO remove multiplier in future
      allowNull: false,
      type: DataTypes.STRING
    },
    parentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    tableName: 'ratings',
    freezeTableName: true,
    classMethods: {
      // associations can be defined here
      associate: function(models) {
        Rating.belongsTo(models.Mood, {foreignKey: 'parentId', targetKey: 'id'});
        Rating.belongsTo(models.Node, {foreignKey: 'parentId', targetKey: 'id'});
        // TODO think about this. Do i even need rating inside Decision?
        Rating.belongsTo(models.Decision, {foreignKey: 'parentId', targetKey: 'NodeId'});
      }
    }
  });
  return Rating;
};