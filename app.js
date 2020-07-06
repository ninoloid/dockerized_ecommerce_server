if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "testing") {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const routes = require('./routes')
const errorHandler = require('./middlewares/errorHandler')
const cors = require('cors')

// CRON JOB
const CronJob = require('cron').CronJob;
const moment = require('moment');
const { Cart, Product } = require('./models')
const { Op } = require('sequelize')
moment().format()

const job = new CronJob('0 */15 * * * *', function () {
  Cart.findAll({ 
    attributes: ['id', 'ProductId', 'quantity'],
    where: { 
    createdAt: {
      [Op.lte] : moment().subtract(1, 'hours').toDate()
    },
    checkout: true
  } })
  .then(products => {
    if (products.length >= 1) {
      products.forEach(product => {

        Product.increment({
          stock: product.quantity
        }, { 
          where: { id: product.ProductId }
        })

        Cart.destroy({ where: { id: product.id } })
      })
    }
  })
  }, null, true, 'Asia/Jakarta');
job.start();
// END OF CRON JOB

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(routes)
app.use(errorHandler)

module.exports = app