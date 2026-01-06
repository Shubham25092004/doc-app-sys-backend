const express = require('express')
const UserController = require('../controllers/userController')

const{auth} = require('../middleware/auth')
const upload =require('../middleware/multer')
const router = express.Router()

router.post('/register',upload.single('userImage'), UserController.register)
router.post('/login', UserController.login)
router.get('/getUserInfo', auth, UserController.getUserInfo)
router.get('/doctorList',auth, UserController.doctorList)
// router.put('/updateUser',auth,upload,UserController.updateUser)

module.exports = router
