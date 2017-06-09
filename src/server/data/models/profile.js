'use strict';
module.exports = function(sequelize, DataTypes) {
  var Profile = sequelize.define('Profile', {
      language: DataTypes.STRING,
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
  }, {
    tableName: 'profiles',
    freezeTableName: true,    
    classMethods: {
      associate: function(models) {
        Profile.belongsTo(models.User, {foreignKey: 'UserId', targetKey: 'id'});
      }
    }
  });
  return Profile;
};