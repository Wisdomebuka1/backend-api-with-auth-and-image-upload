const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')


router.get('/welcome', authMiddleware, (req, res)=>{

    const {id, username, role} = req.userInfo;
    res.json({
        message: 'welcome to home page!',
        user:{
          _id: id,
          username,
          role,
        
        }
  })

})


module.exports = router;