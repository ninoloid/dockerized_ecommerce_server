'use strict';
module.exports = (sequelize, DataTypes) => {
  class Discount extends sequelize.Sequelize.Model {
    static associate(models) {
      // associations
    }
  }

  Discount.init({
    voucherCode: DataTypes.STRING,
    value: DataTypes.INTEGER
  }, { sequelize });
  return Discount;
};