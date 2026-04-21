const jwt = require('jsonwebtoken')

const authMiddleware =(req, res, next)=>{
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    // console.log(token)

    if(!token){
         return res.status(401).json({
            sucess: false,
            message: 'Access denied!. No token provided please login to continue'
        })
    }

    try{
       const decodeTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY)
      
        req.userInfo = decodeTokenInfo;
        next()
    }catch(err){
        return res.status(401).json({
            sucess: false,
            message: 'Invalid token! Please login again.!'
        
        })
    }
  
    
    // console.log(authHeader)
  
}


module.exports = authMiddleware