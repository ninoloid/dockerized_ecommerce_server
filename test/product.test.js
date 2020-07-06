const request = require('supertest')
const app = require('../app')
const { sequelize, User } = require('../models')
const { queryInterface } = sequelize
const { sign } = require('../helpers/jwt')

describe('Product Routes', () => {
  let admin_access_token
  let notActiveAdmin_access_token
  let user_access_token
  let product_id

  beforeAll((done) => {
    const createAdmin = User.create({
      username: 'adminadmin',
      email: 'admin@admin.com',
      password: 'adminadmin',
      isAdmin: true,
      isActivated: true
    })

    const notActivatedAdmin = User.create({
      username: 'fakeadmin',
      email: 'fakeadmin@admin.com',
      password: 'fakeadmin',
      isAdmin: true,
      isActivated: false
    })

    const createUser = User.create({
      username: 'useruser',
      email: 'user@user.com',
      password: 'useruser'
    })

    Promise.all([createAdmin, notActivatedAdmin, createUser])
      .then(users => {
        const admin = users[0]
        const notActiveAdmin = users[1]
        const user = users[2]
        admin_access_token = sign({ id: admin.id })
        notActiveAdmin_access_token = sign({ id: notActiveAdmin.id })
        user_access_token = sign({ id: user.id })
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
  })

  // PRODUCT ROUTES TEST
  describe('Add Product', () => {

    describe('Product added successfully', () => {
      test('Should return status 201, success message, and product data(name, description, category, price, stock, imageUrl', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            price: 100000,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { msg, product } = body
            product_id = product.id
            expect(err).toBe(null);
            expect(msg).toBe('Product added to the database')
            expect(product).toHaveProperty('id')
            expect(product).toHaveProperty('name')
            expect(product).toHaveProperty('description')
            expect(product).toHaveProperty('CategoryId')
            expect(product).toHaveProperty('price')
            expect(product).toHaveProperty('stock')
            expect(product).toHaveProperty('imageUrl')
            expect(status).toBe(201);
            done()
          })
      })
    })

    describe('Failed to add product', () => {
      test('On authentication failed, return status 403 and error message "Please login first"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            price: 100000,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj',
              expect.objectContaining({
                msg: 'This page can only be accessed by registered users, please login first'
              })
            )
            expect(status).toBe(403);
            done()
          })
      })

      test('On authorization failed, return status 401 and error message "Sorry, you\'re not authorized"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            price: 100000,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', user_access_token)
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj',
              expect.objectContaining({
                msg: 'Sorry, you\'re not authorized'
              })
            )
            expect(status).toBe(401);
            done()
          })
      })

      test('On authorization failed, return status 401 and error message "Sorry, your admin account isn\'t activated yet"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            price: 100000,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', notActiveAdmin_access_token)
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj',
              expect.objectContaining({
                msg: 'Sorry, your admin account isn\'t activated yet'
              })
            )
            expect(status).toBe(401);
            done()
          })
      })

      test('On null or empty product name, return status 400 and error message "Product name cannot be empty"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: '',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            price: 100000,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'Validation Error')
            expect(errObj).toHaveProperty('errors', expect.arrayContaining(['Product name cannot be empty']))
            expect(status).toBe(400);
            done()
          })
      })

      test('On null or empty product description, return status 400 and error message "Product description cannot be empty"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: '',
            CategoryId: 1,
            price: 100000,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'Validation Error')
            expect(errObj).toHaveProperty('errors', expect.arrayContaining(['Product description cannot be empty']))
            expect(status).toBe(400);
            done()
          })
      })

      test('On null or empty product category, return status 400 and error message "Product category cannot be empty"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: null,
            price: 100000,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'Validation Error')
            expect(errObj).toHaveProperty('errors', expect.arrayContaining(['Product category cannot be empty']))
            expect(status).toBe(400);
            done()
          })
      })

      test('On null or empty product price, return status 400 and error message "Price cannot be empty"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'Validation Error')
            expect(errObj).toHaveProperty('errors', expect.arrayContaining(['Product price cannot be empty']))
            expect(status).toBe(400);
            done()
          })
      })

      test('On null or empty product stock, return status 400 and error message "Stock cannot be empty"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            price: 100000,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'Validation Error')
            expect(errObj).toHaveProperty('errors', expect.arrayContaining(['Product stock cannot be empty']))
            expect(status).toBe(400);
            done()
          })
      })

      test('On price less than 0, return status 400 and error message "Price must be greater than 0"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            price: -1,
            stock: 10,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'Validation Error')
            expect(errObj).toHaveProperty('errors', expect.arrayContaining(['Price must be greater than 0']))
            expect(status).toBe(400);
            done()
          })
      })

      test('On stock less than 0, return status 400 and error message "Stock must be greater than 0"', (done) => {
        request(app)
          .post('/product')
          .send({
            name: 'produk 1',
            description: 'deskripsi produk 1',
            CategoryId: 1,
            price: 100000,
            stock: -1,
            imageUrl: 'https://radscanmedical.com/wp-content/uploads/2018/11/coming-soon.png'
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(err).toBe(null);
            expect(errObj).toHaveProperty('msg', 'Validation Error')
            expect(errObj).toHaveProperty('errors', expect.arrayContaining(['Stock must be greater than 0']))
            expect(status).toBe(400);
            done()
          })
      })
    })

  })

  describe('Show All Products', () => {
    test('Should return status 200 and display all products', (done) => {
      request(app)
        .get('/product')
        .end((err, response) => {
          const { body, status } = response
          expect(body).toHaveProperty('products', expect.arrayContaining([expect.objectContaining({ id: expect.any(Number) })]))
          expect(body).toHaveProperty('products', expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]))
          expect(body).toHaveProperty('products', expect.arrayContaining([expect.objectContaining({ description: expect.any(String) })]))
          expect(body).toHaveProperty('products', expect.arrayContaining([expect.objectContaining({ CategoryId: expect.any(Number) })]))
          expect(body).toHaveProperty('products', expect.arrayContaining([expect.objectContaining({ price: expect.any(Number) })]))
          expect(body).toHaveProperty('products', expect.arrayContaining([expect.objectContaining({ stock: expect.any(Number) })]))
          expect(body).toHaveProperty('products', expect.arrayContaining([expect.objectContaining({ imageUrl: expect.any(String) })]))
          expect(status).toBe(200);
          done()
        })
    })
  })

  describe('Show One Products', () => {
    test('Should return status 200 and display one product by ID', (done) => {
      request(app)
        .get('/product/' + product_id)
        .end((err, response) => {
          const { body, status } = response
          const { product } = body
          expect(product).toHaveProperty('id')
          expect(product).toHaveProperty('name')
          expect(product).toHaveProperty('description')
          expect(product).toHaveProperty('CategoryId')
          expect(product).toHaveProperty('price')
          expect(product).toHaveProperty('stock')
          expect(product).toHaveProperty('imageUrl')
          expect(status).toBe(200);
          done()
        })
    })
  })

  describe('Update Product', () => {
    describe('Product updated successfully', () => {
      test('Should return status 200 and update product by ID', (done) => {
        request(app)
          .put('/product/' + product_id)
          .send({
            name: 'produk 1 updated',
          })
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            expect(body).toHaveProperty('msg', 'Product updated successfully')
            expect(status).toBe(200);
            done()
          })
      })
    })

    describe('Failed to update product', () => {
      test('Should return status 403 and error message that this route can only be accessed by registered user', (done) => {
        request(app)
          .put('/product/' + product_id)
          .send({
            name: 'produk 1 updated',
          })
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(errObj).toHaveProperty('msg', 'This page can only be accessed by registered users, please login first')
            expect(status).toBe(403);
            done()
          })
      })

      test('Should return status 400 and error message that user isn\'t authorized', (done) => {
        request(app)
          .put('/product/' + product_id)
          .send({
            name: 'produk 1 updated',
          })
          .set('access_token', user_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(errObj).toHaveProperty('msg', 'Sorry, you\'re not authorized')
            expect(status).toBe(401);
            done()
          })
      })
    })
  })

  describe('Delete Product', () => {

    describe('Product deleted successfully', () => {
      test('Should return status 200 and delete product by ID', (done) => {
        request(app)
          .delete('/product/' + product_id)
          .set('access_token', admin_access_token)
          .end((err, response) => {
            const { body, status } = response
            expect(body).toHaveProperty('msg', 'Product deleted successfully')
            expect(status).toBe(200);
            done()
          })
      })
    })

    describe('Failed to delete product', () => {
      test('Should return status 403 and error message that this route can only be accessed by registered user', (done) => {
        request(app)
          .delete('/product/' + product_id)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(errObj).toHaveProperty('msg', 'This page can only be accessed by registered users, please login first')
            expect(status).toBe(403);
            done()
          })
      })

      test('Should return status 400 and error message that that user isn\'t authorized', (done) => {
        request(app)
          .delete('/product/' + product_id)
          .set('access_token', user_access_token)
          .end((err, response) => {
            const { body, status } = response
            const { errObj } = body
            expect(errObj).toHaveProperty('msg', 'Sorry, you\'re not authorized')
            expect(status).toBe(401);
            done()
          })
      })
    })

  })
  // END OF PRODUCT ROUTES TEST
})