'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('Users', 'isActivated', Sequelize.BOOLEAN )
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('Users', 'isActivated');
  }
};
