'use strict';
const bcrypt   = require('bcrypt-nodejs');

// TODO: password hash must not be leaked to client.
// Add default scope without "password" field.

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
    /**
     * In default scope we must exclude emails
     * and password informaiton so it wont accidentaly be leaked to hackers.
     */
    defaultScope: {
      where: {},
      attributes: {
        exclude: ['password', 'email'],
      }
    },
    scopes: {
      /**
       * This scope allows us to manipulate
       * sensitive data in APIs.
       */
      all: {
        where: {},
        attributes: {exclude: []}
      }
    }
  })
  // Class Methods
  Local.associate = function (models) {
    // associations can be defined here
    Local.belongsTo(models.User, { foreignKey: 'UserId', targetKey: 'id' })
  }
  Local.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }
  // Instance Methods
  Local.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }
  return Local;
};