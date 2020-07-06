const router = require('express').Router()
const { productController } = require('../controllers')
const authentication = require('../middlewares/authentication')
const { isActivatedAdmin } = require('../middlewares/authorization')
const s3upload = require('../middlewares/s3upload')
const multer = require('multer')

router
  .route('/')
  .post(multer({ dest: 'temp/', limits: { fieldSize: 3 * 1024 * 1024 } }).single('imageUrl'), authentication, isActivatedAdmin, s3upload, productController.addProduct)
router.get('/', productController.getAllProduct)
router.get('/:id', productController.getOneProduct)
// router.put('/:id', authentication, authorization, productController.updateProduct)
router
  .route('/:id')
  .put(multer({ dest: 'temp/', limits: { fieldSize: 3 * 1024 * 1024 } }).single('imageUrl'), authentication, isActivatedAdmin, s3upload, productController.updateProduct)
router.delete('/:id', authentication, isActivatedAdmin, productController.deleteProduct)

module.exports = router