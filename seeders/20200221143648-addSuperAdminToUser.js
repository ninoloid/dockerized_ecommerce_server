'use strict';

const { hash } = require('../helpers/hash')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const superAdmin = [{
      username: 'superadmin',
      email: 'superadmin@ninoloid.com',
      password: hash('superadmin'),
      isAdmin: true,
      isSuperAdmin: true,
      isActivated: true
    }]
    return queryInterface.bulkInsert('Users', superAdmin, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
