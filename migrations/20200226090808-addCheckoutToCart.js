'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('Carts', 'checkout', Sequelize.BOOLEAN )
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('Carts', 'checkout');
  }
};
