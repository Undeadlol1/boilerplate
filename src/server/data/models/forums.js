'use strict';
module.exports = function(sequelize, DataTypes) {
  var Forums = sequelize.define('Forums', {
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
    UserId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {
    classMethods: {
      tableName: 'forums',
      freezeTableName: true,
      // defaultScope: {
      //   include: [{
      //     model: require('./revisions'),
      //     where: {active: true},
      //   }],
      // },
      associate: function(models) {
        Forums.belongsTo(models.User, {
          // onDelete: "CASCADE", // TODO implement this?
          foreignKey: {
            allowNull: false
          }
        });
        // TODO
        // Forums.hasMany(models.Revisions)
      },
      // TODO do we need this?
      findIdBySlug: function(slug) {
        return Forums
                .findOne({ where: { slug } })
                .then(skill => skill && skill.get('id'))
      }
    }
  });
  return Forums;
};