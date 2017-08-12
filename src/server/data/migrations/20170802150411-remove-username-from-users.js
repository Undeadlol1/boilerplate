'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface
    /**
     * ⚠️ somehow it was impossible to delete "username" column due to:
     * "Error: ER_CANT_DROP_FIELD_OR_KEY: Can't DROP 'username'; check that column/key exists"
     * so, making it nullable is a solution
     */
      .changeColumn('users', 'username', {
        unique: false,
        allowNull: true,
        type: Sequelize.STRING,
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  },

  down: function (queryInterface, Sequelize) {
    return
    // return queryInterface.addColumn('users', 'username', {type: Sequelize.STRING})
  }
};
