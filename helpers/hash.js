const bcryptjs = require('bcryptjs')

module.exports = {
  hash(password) {
    const salt = bcryptjs.genSaltSync(10)
    return bcryptjs.hashSync(password, salt)
  },

  compare(password, hashedPassword) {
    return bcryptjs.compareSync(password, hashedPassword)
  }
}