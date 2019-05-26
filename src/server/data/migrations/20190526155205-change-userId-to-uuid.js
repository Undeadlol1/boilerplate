'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.changeColumn(
      'users',
      'id',
      {
        allowNull: false,
        // primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return queryInterface.changeColumn(
      'users',
      'id',
      {
        allowNull: false,
        autoIncrement: true,
        // primaryKey: true,
        type: Sequelize.INTEGER
      }
    )
  }
};
