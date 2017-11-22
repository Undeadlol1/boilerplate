'use strict';
module.exports = function(sequelize, DataTypes) {
  var Threads = sequelize.define('Threads', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
    },
    slug: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
    },
    text: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    isClosed: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    parentId: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      tableName: 'threads',
      freezeTableName: true,
      // defaultScope: {
      //   include: [{
      //     model: require('./revisions'),
      //     where: {active: true},
      //   }],
      // },
      associate: function(models) {
        Threads.belongsTo(models.User, {
          // onDelete: "CASCADE", // TODO implement this?
          foreignKey: {
            allowNull: false
          }
        });
        // TODO
        // Threads.hasMany(models.Revisions)
      },
      // TODO do we need this?
      findIdBySlug: function(slug) {
        return Threads
                .findOne({ where: { slug } })
                .then(skill => skill && skill.get('id'))
      }
    }
  });
  return Threads;
};