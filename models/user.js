'use strict';
module.exports = (sequelize, DataTypes) => {
  const { hash } = require('../helpers/hash')

  class User extends sequelize.Sequelize.Model {
    static associate(models) {
      User.belongsToMany(models.Product, { through: models.Cart })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6],
          msg: "The minimum length of username is 6"
        },
        notNull: {
          args: true,
          msg: "Username cannot be empty"
        },
        isUnique(username) {
          return User.findOne({ where: { username } })
            .then(data => {
              if (data) throw new Error('Username already registered')
            })
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email format"
        },
        len: {
          args: [10],
          msg: "The minimum length of email is 10"
        },
        notNull: {
          args: true,
          msg: "Email cannot be empty"
        },
        isUnique(email) {
          return User.findOne({ where: { email } })
            .then(data => {
              if (data) throw new Error('Email already registered')
            })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6],
          msg: "The minimum length of password is 6"
        },
        notNull: {
          args: true,
          msg: "Password cannot be empty"
        }
      }
    },
    isAdmin: DataTypes.BOOLEAN,
    isSuperAdmin: DataTypes.BOOLEAN,
    isActivated: DataTypes.BOOLEAN
  }, {
    sequelize,
    hooks: {
      beforeCreate: user => {
        user.password = hash(user.password)
      }
    }
  });
  return User;
};