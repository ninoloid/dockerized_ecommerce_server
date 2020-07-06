'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const category = [
      {name: 'Computer'},
      {name: 'Smartphone'},
      {name: 'Peripheral'},
      {name: 'Accessories'}
    ]
    return queryInterface.bulkInsert('Categories', category, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
