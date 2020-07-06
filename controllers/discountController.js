const { Discount } = require('../models')

module.exports = {
  getDiscount(req, res, next) {
    const { voucherCode } = req.body
    
    Discount.findOne({ where: { voucherCode } })
      .then(voucher => {
        if (voucher) {
          res
            .status(200)
            .json(voucher)
        } else {
          next({ name: "vouchernotfound" })
        }
      })
      .catch(next)
  }
}