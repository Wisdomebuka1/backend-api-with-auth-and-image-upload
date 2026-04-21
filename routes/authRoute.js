const{registerUser, loginUser, changePassword} = require('../controllers/authController')
const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')


//All related to authorization and authentication
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password', authMiddleware, changePassword)


module.exports = router;
