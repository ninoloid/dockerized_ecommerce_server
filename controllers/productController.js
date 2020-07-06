const { Product, Category } = require('../models')

module.exports = {
  addProduct(req, res, next) {
    const { name, description, CategoryId, price, stock } = req.body
    const { imageUrl } = req
    
    Product.create({
      name,
      description,
      CategoryId,
      price,
      stock,
      imageUrl
    })
      .then(product => {
        res
          .status(201)
          .json({ msg: "Product added to the database", product })
      })
      .catch(next)
  },

  getAllProduct(req, res, next) {
    Product.findAll({include: Category})
      .then(products => {
        res
          .status(200)
          .json({ products })
      })
      .catch(next)
  },

  getOneProduct(req, res, next) {
    const { id } = req.params
    Product.findOne({ where: { id }, include: Category })
      .then(product => {
        res
          .status(200)
          .json({ product })
      })
      .catch(next)
  },

  updateProduct(req, res, next) {
    const { id } = req.params
    const { name, description, CategoryId, price, stock } = req.body

    let imageUrl
    if (req.imageUrl !== 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png') {
      imageUrl = req.imageUrl
    }

    Product.update({
      name,
      description,
      CategoryId,
      price,
      stock,
      imageUrl
    }, { where: { id } })
      .then(result => {
        if (result[0]) {
          res
            .status(200)
            .json({ msg: "Product updated successfully" })
        } else {
          next({ msg: "Product not found" })
        }
      })
      .catch(next)
  },

  deleteProduct(req, res, next) {
    const { id } = req.params
    Product.destroy({ where: { id } })
      .then(result => {
        if (!result) {
          next({ msg: "Product not found" })
        } else {
          res
            .status(200)
            .json({ msg: "Product deleted successfully" })
        }
      })
      .catch(next)
  }
}