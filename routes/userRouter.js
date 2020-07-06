const router = require('express').Router()
const { userController } = require('../controllers')
const authentication = require('../middlewares/authentication')
const { isSuperAdmin, isActivatedAdmin } = require('../middlewares/authorization')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/showUsers', userController.showUsers)
router.patch('/updateAdmin/:id', authentication, isSuperAdmin, userController.updateAdminStatus)
router.delete('/deleteAdmin/:id', authentication, isSuperAdmin, userController.deleteUser)
router.patch('/updateUserPassword/:id', authentication, isActivatedAdmin, userController.updateUserPassword)
router.delete('/deleteUser/:id', authentication, isActivatedAdmin, userController.deleteUser)
router.get('/', (req, res) => res.send("It works"))

module.exports = router