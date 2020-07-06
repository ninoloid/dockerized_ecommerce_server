'use strict';
module.exports = (sequelize, DataTypes) => {
  class Cart extends sequelize.Sequelize.Model { }

  Cart.init({
    UserId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    checkout: DataTypes.BOOLEAN
  }, {
    sequelize,
    hooks: {
      beforeCreate(Cart) {
        Cart.quantity = 1
      }
    }
  });
  return Cart;
};