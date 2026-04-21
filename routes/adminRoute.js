const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')


router.get('/welcome', authMiddleware, adminMiddleware, (req, res)=>{
   res.status(200).json({
      message: 'welcome to admin dashboard'
   })
})


module.exports = router

