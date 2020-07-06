'use strict';
module.exports = (sequelize, DataTypes) => {
  class Product extends sequelize.Sequelize.Model {
    static associate(models) {
      // Product.belongsToMany(models.User, { through: models.Cart })
      Product.belongsTo(models.Category)
    }
  }

  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Product name cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Product name cannot be empty"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Product description cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Product description cannot be empty"
        }
      }
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "Can only receive number for product category"
        },
        notNull: {
          args: true,
          msg: "Product category cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Product category cannot be empty"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Product price cannot be empty"
        },
        isInt: {
          args: true,
          msg: "Can only receive number for price field"
        },
        notEmpty: {
          args: true,
          msg: "Product price cannot be empty"
        },
        min: {
          args: [0],
          msg: "Price must be greater than 0"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Product stock cannot be empty"
        },
        isInt: {
          args: true,
          msg: "Can only receive number for stock field"
        },
        notEmpty: {
          args: true,
          msg: "Product stock cannot be empty"
        },
        min: {
          args: [0],
          msg: "Stock must be greater than 0"
        }
      }
    },
    // imageUrl: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       args: true,
    //       msg: "Image URL cannot be empty"
    //     },
    //     notEmpty: {
    //       args: true,
    //       msg: "Image URL cannot be empty"
    //     }
    //   }
    // },
    imageUrl: DataTypes.STRING
  }, { sequelize });
  return Product;
};