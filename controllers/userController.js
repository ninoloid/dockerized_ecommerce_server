const { User } = require('../models')
const { compare } = require('../helpers/hash')
const { sign } = require('../helpers/jwt')
const { Op } = require('sequelize')
const { hash } = require('../helpers/hash')

module.exports = {
  register(req, res, next) {
    const { username, email, password, isAdmin } = req.body
    User.create({
      username,
      email,
      password,
      isAdmin
    })
      .then(user => {
        const payload = {
          id: user.id
        }
        const token = sign(payload)
        res
          .status(201)
          .json({ token, username: user.username })
      })
      .catch(next)
  },

  login(req, res, next) {
    const { identification, password } = req.body
    User.findOne({
      where: {
        [Op.or]: [
          { username: identification },
          { email: identification }
        ]
      }
    })
      .then(user => {
        const valid = compare(password, user.password)
        if (!valid) {
          // invalid password
          next({ msg: "Invalid Username, Email, or Password" })
        } else {
          const payload = {
            id: user.id
          }
          const token = sign(payload)
          res
            .status(200)
            .json({ token, username: user.username, isSuperAdmin: user.isSuperAdmin })
        }
      })
      .catch(err => {
        // invalid email
        next({ msg: "Invalid Username, Email, or Password" })
      })
  },

  showUsers(req, res, next) {
    User.findAll()
    .then(users => {
      res
        .status(200)
        .json(users)
    })
    .catch(next)
  },

  updateAdminStatus(req, res, next) {
    const { id } = req.params
    const { isActivated } = req.body
    User.update({
      isActivated
    }, { where: { id }} )
      .then(result => {
        if (result[0]) {
          res
            .status(200)
            .json({ msg: "Admin status updated successfully" })
        } else {
          next({ msg: "Admin account not found" })
        }
      })
      .catch(next)
  },

  deleteUser(req, res, next) {
    const { id } = req.params
    User.destroy({ where: { id } })
      .then(result => {
        if (!result) {
          next({ msg: "Admin account not found" })
        } else {
          res
            .status(200)
            .json({ msg: "Admin account deleted successfully" })
        }
      })
      .catch(next)
  },

  updateUserPassword(req, res, next) {
    const { id } = req.params
    let { password } = req.body
    password = hash(password)
    
    User.update({
      password
    }, { where: { id }} )
      .then(result => {
        if (result[0]) {
          res
            .status(200)
            .json({ msg: "User password updated successfully" })
        } else {
          next({ msg: "User not found" })
        }
      })
      .catch(next)
  }
}