'use strict';
module.exports = function(sequelize, DataTypes) {
  var Threads = sequelize.define('Threads', {
    id: {
      unique: true,
      primaryKey: true,
      type: DataTypes.UUID,
      validate: { isUUID: 4 },
      defaultValue: DataTypes.UUIDV4,
      comment: 'Unique identifier',
    },
    name: {
      comment: 'Human readable name for a thread',
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
      // validate: {
      //   isLength: {min: 5,}
      // }
    },
    slug: {
      comment: 'Url friendly name of a forum.',
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
        },
      },
    },
    text: {
      comment: 'Thread\'s main text',
      allowNull: false,
      type: DataTypes.TEXT,
    },
    isClosed: {
      comment: 'Defines if users can post in this thread or not.',
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    parentId: {
      comment: 'Unique identifier of parent document. Usually it is a Forum.',
      allowNull: false,
      type: DataTypes.UUID,
    },
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      comment: 'Unique id of a user who created this forum.',
    },
  }, {
    tableName: 'threads',
    freezeTableName: true,
  });
  // Class methods
  Threads.associate = function(models) {
    Threads.belongsTo(models.User, {
      foreignKey: { allowNull: false }
    })
  }
  /**
   * find thread.id by thread.slug
   * @param {string} slug thread.slug
   * @returns thread.id
   */
  Threads.findIdBySlug = function(slug) {
    return Threads
      .findOne({ where: { slug } })
      .then(thread => thread && thread.get('id'))
  }
  return Threads;
};