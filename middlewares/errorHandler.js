module.exports = (err, req, res, next) => {
  // console.log('error handlers', err)
  let status = 500
  let errObj = {
    msg: "Internal Server Error"
  }

  if (err.name === "SequelizeValidationError") {
    status = 400
    errObj.msg = "Validation Error"
    errObj.errors = err.errors.map(error => error.message)
  } else if (err.msg === 'Invalid Username, Email, or Password') {
    status = 400
    errObj.msg = err.msg
  } else if (err.type === 'not login' || err.name === 'JsonWebTokenError') {
    status = 403
    errObj.msg = "This page can only be accessed by registered users, please login first"
  } else if (err.type === 'not authorized') {
    status = 401
    errObj.msg = "Sorry, you're not authorized"
  } else if (err.type === 'not activated') {
    status = 401
    errObj.msg = "Sorry, your admin account isn't activated yet"
  } else if (err.msg === 'Product not found') {
    status = 404
    errObj.msg = err.msg
  } else if (err.msg === 'Admin account not found') {
    status = 404
    errObj.msg = err.msg
  } else if (err.msg === 'User not found') {
    status = 404
    errObj.msg = err.msg
  } else if (err.type === 'forbidden area') {
    status = 403
    errObj.msg = "This page can only be accessed by super admin. You're not!"
  } else if (err.name === 'outofstock') {
    status = 400
    errObj.msg = "Sorry, we're running out of stock"
  } else if (err.name === 'vouchernotfound') {
    status = 404
    errObj.msg = "Invalid voucher code"
  } else if (err.name === 'nothingprocessed') {
    status = 500
    errObj.msg = "An error occurred. Please refresh this website"
  }

  res
    .status(status)
    .json({ errObj })
}