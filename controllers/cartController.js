const { Cart, User, Product } = require('../models')

module.exports = {
  addToCart(req, res, next) {
    console.log('aaaaaaaaaaaaaaaa', req.body.type)
    const { ProductId, type } = req.body
    const UserId = req.currentUserId 
    
    Cart.findOrCreate({
      where: {
        UserId,
        ProductId,
        checkout: false
      },
        UserId,
        ProductId,
        checkout: false
    })
      .then(product => {
        if (product[0].id) {
          res
          .status(201)
          .json({ msg: "Product added to cart", product })
        } else {
          Product.findOne({ where: { id: ProductId } })
          .then(item => {
            const quantity = item.stock
            let newQty
            console.log('tipenya', type)
            if (type === 'add') {
              newQty = product[0].quantity + 1
            } else {
              newQty = product[0].quantity - 1
            }
            if (quantity >= newQty) {
              Cart.update({
                quantity: newQty
              }, { where: { ProductId, UserId, checkout: false } })
              .then(() => {
                res
                .status(201)
                .json({ msg: "Quantity updated" })
              })
              .catch(next)
            } else {
              next({ name: "outofstock" })
            }
          })
          .catch(next)
        }
      })
      .catch(next)
  },

  getCart(req, res, next) {
    const id = req.currentUserId
    User.findOne({
      where: { id },
      attributes: ['id', 'username'],
      include: Product
    })
      .then(cart => {
        res
          .status(200)
          .json(cart.Products)
      })
      .catch(err => {
        next(err)
      })
  },

  deleteFromCart(req, res, next) {
    const { UserId, ProductId } = req.body
    const checkout = false
    Cart.destroy({ where: { UserId, ProductId, checkout } })
      .then(() => {
        res
          .status(200)
          .json({ msg: "Product removed from cart successfully" })
      })
      .catch(err => {
        next(err)
      })
  },

  checkedOut(req, res, next) {
    const id = req.currentUserId

    Cart.findAll({ attributes: ['id', 'ProductId', 'quantity'], where: { UserId: id, checkout: false } })
      .then(products => {
        let arrPromise = []
        let arrQuantity = []

        for (let i = 0; i < products.length; i++) {
          const promise = Product.findOne({ where: { id: products[i].ProductId } })
          const qty = products[i].quantity
          arrPromise.push(promise)
          arrQuantity.push(qty)
        }

        Promise.all(arrPromise)
          .then(values => {
            let willUpdate = true
            let arrStock = []
            for (let i = 0; i < values.length; i++) {
              arrStock.push(values[i].stock)
              if (values[i].stock < arrQuantity[i]) {
                willUpdate = false
              }
            }
            return { arrStock, willUpdate }
          })

          .then(data => {
            if (data.willUpdate) {
              
              let arrWillUpdate = []
              for (let i = 0; i < products.length; i++) {

                const promise1 = Cart.update({
                  checkout: true
                }, { where: { id: products[i].id } })

                const newStock = data.arrStock[i] - arrQuantity[i]
                const promise2 = Product.update({
                  stock: newStock
                }, { where: { id: products[i].ProductId } })

                arrWillUpdate.push(promise1, promise2)
              }

              Promise.all(arrWillUpdate)
                .then(values => {
                  let success
                  if (values.length > 0) {
                    success = true
                  } else {
                    success = false
                  }
                  values.forEach(value => {
                    if (value[0] !== 1) success = false
                  })
                  if (success) {
                    res
                      .status(200)
                      .json({ msg: "Checkout success" })
                  } else {
                    next({ name: "nothingprocessed" })
                  }
                })
                .catch(next)
            } else {
              next({ name: "outofstock" })
            }
          })
          .catch(next)
      })
      .catch(next)
  }
}

