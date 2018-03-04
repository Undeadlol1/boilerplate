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
        // validate: {
        //   isLength: {min: 5,}
        // }
    },
    slug: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          trim: true,
          // i don't know which one works
          min: 5,
          max: 100,
          isLength: {
            options: { min: 5, max: 100 },
          }
      }
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
      associate: function(models) {
        Threads.belongsTo(models.User, {
          foreignKey: {allowNull: false}
        })
      },
      /* MODEL METHODS */
      /**
       * find thread.id by thread.slug
       * @param {string} slug thread.slug
       * @returns thread.id
       */
      findIdBySlug(slug) {
        return Threads
          .findOne({ where: { slug } })
          .then(thread => thread && thread.get('id'))
      }
    }
  });
  return Threads;
};