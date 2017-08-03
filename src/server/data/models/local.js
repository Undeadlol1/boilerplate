'use strict';
var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var Local = sequelize.define('Local', {
    // TODO add checks: must not have spaces
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      validate: {
        isEmail: true,
        notContains: [' '],
      }
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'compositeIndex',
      validate: {
        notContains: [' '],
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notContains: [' '],
      }
    }
  }, {
    tableName: 'locals',
    freezeTableName: true,
    classMethods: {
      generateHash: function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },
      // associations can be defined here
      associate: function(models) {
        Local.belongsTo(models.User, {foreignKey: 'UserId', targetKey: 'id'})
      }
    },
    instanceMethods: {
      validPassword: function(password) {
        return bcrypt.compareSync(password, this.password)
      }
    },
    // defaultScope: {
    //   // where: {},
    //   // attributes: { exclude: ['password'] },
    // },
    // scopes: {
    //   protected: {
    //     where: {},
    //   }
    // }
  });
  return Local;
};