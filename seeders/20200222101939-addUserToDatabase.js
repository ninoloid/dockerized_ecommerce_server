'use strict';

const { hash } = require('../helpers/hash')

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [
      {
        username: 'johndoe',
        email: 'johndoe@gmail.com',
        password: hash('johndoe'),
      },
      {
        username: 'janedoe',
        email: 'janedoe@gmail.com',
        password: hash('janedoe'),
      }
    ]
    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
