'use strict';
module.exports = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model {
    static associate(models) {
      // associations
    }
  }

  Category.init({
    name: DataTypes.STRING
  }, { sequelize });
  return Category;
};