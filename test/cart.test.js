const request = require('supertest')
const app = require('../app')
const { sequelize, User, Product } = require('../models')
const { queryInterface } = sequelize
const { sign } = require('../helpers/jwt')

describe('Product Routes', () => {
  let access_token
  let ProductId
  let UserId
  let cart_id

  beforeAll((done) => {
    const addUser = User.create({
      username: 'adminadmin',
      email: 'admin@admin.com',
      password: 'adminadmin',
      isAdmin: true,
      isActivated: true
    })

    const addProduct = Product.create({
      name: 'produk 1',
      description: 'deskripsi produk 1',
      CategoryId: 1,
      price: 100000,
      stock: 10,
      imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
    })

    Promise.all([addUser, addProduct])
      .then(values => {
        const user = values[0]
        const product = values[1]

        UserId = user.id
        access_token = sign({ id: user.id })
        ProductId = product.id
        done()
      })
      .catch(err => console.log(err))

  })

  afterAll((done) => {
    queryInterface.bulkDelete('Products')
      .then(response => {
        done()
      }).catch(err => done(err))

    queryInterface.bulkDelete('Users')
      .then(response => {
        done()
      }).catch(err => done(err))

    queryInterface.bulkDelete('Carts')
      .then(response => {
        done()
      }).catch(err => done(err))
  })

  // CART ROUTES TEST
  describe('Add product to cart', () => {

    describe('Product added to cart', () => {
      test('Should return status 201 and message that product added to cart', (done) => {
        request(app)
          .post('/cart')
          .send({
            UserId,
            ProductId,
            quantity: 10
          })
          .set('access_token', access_token)
          .end((err, response) => {
            const { body, status } = response
            const { msg, product } = body
            expect(err).toBe(null);
            expect(msg).toBe('Product added to cart')
            expect(product).toHaveProperty('id')
            expect(product).toHaveProperty('UserId')
            expect(product).toHaveProperty('ProductId')
            expect(product).toHaveProperty('quantity')
            expect(status).toBe(201);
            cart_id = product.id
            done()
          })
      })
    })

    describe('Failed to add product to cart', () => {
      test('Should return status 403 and error message that this route can only be accessed by registered users', (done) => {
        request(app)
          .post('/cart')
          .send({
            UserId,
            ProductId,
            quantity: 10
          })
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'This page can only be accessed by registered users, please login first')
            expect(status).toBe(403);
            done()
          })
      })
    })

  })

  describe('User cart detail (show user cart)', () => {

    describe('Show user cart', () => {
      test('Should return status 200 and user cart by User ID', (done) => {
        request(app)
          .get('/cart/' + UserId)
          .set('access_token', access_token)
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('id')
            expect(body).toHaveProperty('username')
            expect(body).toHaveProperty('Products', expect.arrayContaining([expect.objectContaining({ id: expect.any(Number) })]))
            expect(body).toHaveProperty('Products', expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]))
            expect(body).toHaveProperty('Products', expect.arrayContaining([expect.objectContaining({ description: expect.any(String) })]))
            expect(body).toHaveProperty('Products', expect.arrayContaining([expect.objectContaining({ CategoryId: expect.any(Number) })]))
            expect(body).toHaveProperty('Products', expect.arrayContaining([expect.objectContaining({ price: expect.any(Number) })]))
            expect(body).toHaveProperty('Products', expect.arrayContaining([expect.objectContaining({ stock: expect.any(Number) })]))
            expect(body).toHaveProperty('Products', expect.arrayContaining([expect.objectContaining({ imageUrl: expect.any(String) })]))
            expect(status).toBe(200)
            done()
          })
      })
    })

    describe('Failed to show user cart', () => {
      test('Should return status 403 and error message that this route can only be accessed by registered users', (done) => {
        request(app)
          .get('/cart/' + UserId)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'This page can only be accessed by registered users, please login first')
            expect(status).toBe(403);
            done()
          })
      })
    })

  })

  describe('Modify user cart (remove)', () => {

    describe('Failed to delete item from user cart', () => {
      test('Should return status 403 and error message that this route can only be accessed by registered users', (done) => {
        request(app)
          .delete('/cart/' + cart_id)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'This page can only be accessed by registered users, please login first')
            expect(status).toBe(403);
            done()
          })
      })
    })

    describe('Item successfully deleted from user cart', () => {
      test('Should return status 200 and message that item on cart deleted successfully', (done) => {
        request(app)
          .delete('/cart/' + cart_id)
          .set('access_token', access_token)
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('msg', 'Product removed from cart successfully')
            expect(status).toBe(200)
            done()
          })
      })
    })

  })
  // END OF CART ROUTES TEST
})