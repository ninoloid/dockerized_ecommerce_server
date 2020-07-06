const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize

describe('User Routes', () => {

  afterAll((done) => {
    queryInterface.bulkDelete('Users')
      .then(response => {
        done()
      }).catch(err => done(err))
  })
  // USER ROUTES TEST
  describe('User Register', () => {

    describe('User registered successfully', () => {
      test('Should return status 201 and user data (token & username', (done) => {
        request(app)
          .post('/register')
          .send({
            username: 'adminadmin',
            email: 'admin@admin.com',
            password: 'adminadmin',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('token', expect.any(String))
            expect(body).toHaveProperty('username', 'adminadmin')
            expect(status).toBe(201);
            done()
          })
      })
    })

    describe('User failed to register', () => {
      test('Should return status 400 and validation error on username length (less than 6 characters', (done) => {
        request(app)
          .post('/register')
          .send({
            username: '',
            email: 'admin@admin.com',
            password: 'adminadmin',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['The minimum length of username is 6']) }))
            expect(status).toBe(400);
            done()
          })
      })

      test('Should return status 400 and validation error on email length (less than 10 characters', (done) => {
        request(app)
          .post('/register')
          .send({
            username: 'adminadmin',
            email: '',
            password: 'adminadmin',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['The minimum length of email is 10']) }))
            expect(status).toBe(400);
            done()
          })
      })

      test('Should return status 400 and validation error on password length (less than 6 characters', (done) => {
        request(app)
          .post('/register')
          .send({
            username: 'adminadmin',
            email: 'admin@admin.com',
            password: '',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['The minimum length of password is 6']) }))
            expect(status).toBe(400);
            done()
          })
      })

      test('Should return status 400 and validation error on username (username cannot be empty', (done) => {
        request(app)
          .post('/register')
          .send({
            email: 'admin@admin.com',
            password: 'adminadmin',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['Username cannot be empty']) }))
            expect(status).toBe(400);
            done()
          })
      })

      test('Should return status 400 and validation error on email (email cannot be empty', (done) => {
        request(app)
          .post('/register')
          .send({
            username: 'adminadmin',
            password: 'adminadmin',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['Email cannot be empty']) }))
            expect(status).toBe(400);
            done()
          })
      })

      test('Should return status 400 and validation error on password (password cannot be empty', (done) => {
        request(app)
          .post('/register')
          .send({
            username: 'adminadmin',
            email: 'admin@admin.com',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['Password cannot be empty']) }))
            expect(status).toBe(400);
            done()
          })
      })

      test('Should return status 400 and validation error on username (username already registered', (done) => {
        request(app)
          .post('/register')
          .send({
            username: 'adminadmin',
            email: 'admin2@admin.com',
            password: 'adminadmin',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['Username already registered']) }))
            expect(status).toBe(400);
            done()
          })
      })

      test('Should return status 400 and validation error on email (email already registered', (done) => {
        request(app)
          .post('/register')
          .send({
            username: 'adminadmin2',
            email: 'admin@admin.com',
            password: 'adminadmin',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['Email already registered']) }))
            expect(status).toBe(400);
            done()
          })
      })

      test('Should return status 400 and validation error on email (invalid email format', (done) => {
        request(app)
          .post('/register')
          .send({
            username: 'adminadmin2',
            email: 'admin@admin',
            password: 'adminadmin',
            isAdmin: true,
            isActivated: true
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Validation Error' }))
            expect(body).toHaveProperty('errObj', expect.objectContaining({ errors: expect.arrayContaining(['Invalid email format']) }))
            expect(status).toBe(400);
            done()
          })
      })
    })

  })

  describe('User Login', () => {

    describe('User logged in successfully', () => {
      test('Should return status 200 and user data (token & username', (done) => {
        request(app)
          .post('/login')
          .send({
            identification: 'adminadmin',
            password: 'adminadmin'
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('token', expect.any(String))
            expect(body).toHaveProperty('username', 'adminadmin')
            expect(status).toBe(200);
            done()
          })
      })
    })

    describe('User failed to login', () => {
      test('On invalid identification (username or email), return status 400 and error response (invalid username, email, or password', (done) => {
        request(app)
          .post('/login')
          .send({
            identification: 'adminadmin2',
            password: 'adminadmin'
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Invalid Username, Email, or Password' }))
            expect(status).toBe(400);
            done()
          })
      })

      test('On invalid password, return status 400 and error response (invalid username, email, or password', (done) => {
        request(app)
          .post('/login')
          .send({
            identification: 'adminadmin',
            password: 'adminadmin2'
          })
          .end((err, response) => {
            const { body, status } = response
            expect(err).toBe(null);
            expect(body).toHaveProperty('errObj', expect.objectContaining({ msg: 'Invalid Username, Email, or Password' }))
            expect(status).toBe(400);
            done()
          })
      })
    })

  })
  // END OF USER ROUTES TEST
})