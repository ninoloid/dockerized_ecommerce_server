'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const voucherCode = [
      {
        voucherCode: 'hacktiv',
        value: 30
      },
      {
        voucherCode: 'payday',
        value: 15
      },
      {
        voucherCode: 'harbolnas',
        value: 20
      },
      {
        voucherCode: 'ahmadmsa',
        value: 45
      },
      {
        voucherCode: 'misqueen',
        value: 100
      },
      {
        voucherCode: 'fullstack',
        value: 5
      }
    ]
    return queryInterface.bulkInsert('Discounts', voucherCode, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Discounts', null, {});
  }
};
