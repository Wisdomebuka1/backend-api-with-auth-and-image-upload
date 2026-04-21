const User = require("../models/User");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//register controller
const registerUser = async (req, res) => {
  try {

    
    const { username, password, email, role } = req.body;
    const checkExistingUser = await User.findOne({
      $or: [{username}, {email}],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "user has already exists either the same username or email, please try different email or username",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newCreatedUser = new User({
      username,
      email,
      password: hashPassword,
      role: role || "user"
    });

    const savedUser = await newCreatedUser.save();

    if (savedUser) {
      res.status(201).json({
        success: true,
        message: "user has been registered successfully!",
        user: {
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role,
        },
      });

    }else{
       res.status(404).json({
          success: false,
          message: 'unable to register user, please try again'

       })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "something went wrong, please try again",
    });
  }
};

//loginUser controller
const loginUser = async (req, res) => {
  try {
  
    const{username, password} = req.body

    const user = await User.findOne({username})

    if(!user){
       return res.status(400).json({
            success: false,
            message: 'user does not exist'
        })
    }

    //check wether the password matches from the request object(from end user) matches with hashed password in documents
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if(!isPasswordMatch){
        return res.status(400).json({
            success: false,
            message: 'invalid username or password!'
        })
    }

    const accessToken = jwt.sign({
        id: user._id,
        username: user.username,
        role: user.role

    }, process.env.JWT_SECRET_KEY, {expiresIn: '30m'})


    res.status(200).json({
        success: true,
        message: 'User has successfully loggIn',
        accessToken
    })
    


  } catch (err) {
    res.status(500).json({
      success: false,
      message: "someting went wrong, please try again",
    });
  }
};


const changePassword = async (req, res)=>{
   try{
     //get the userId from middleware passed during login from jwt
     const userId = req.userInfo.id
     //extract old and new password
     const {oldPassword, newPassword} = req.body;


     //check the old password or new password is empty!
     if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "old and new password are required"
      });
    }

    //compare if oldPassword and newPassword are the same!

    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "new password cannot be same as old password"
      });
    }

     const user = await User.findById(userId)

     if(!user){
        return res.status(400).json({
         success: false,
         message: 'user not found!'
         
       })
     }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)

    if(!isPasswordMatch){
      return res.status(400).json({
         success: false,
         message: 'old password is not correct, try again!'
       })
    }

    //hash the password here 
    const salt = await bcrypt.genSalt(10)

    const newHashPassword = await bcrypt.hash(newPassword, salt)

    //update the old password with hashed password stored in DB
    user.password = newHashPassword;

    //save to database
     await user.save()

       return res.status(200).json({
        success: true,
        message: 'password has been changed succcessfully!'
      
       })
      


      
   }catch(error){
    console.log(error)
    res.status(500).json({
      success: false,
      message: "someting went wrong, please try again",
    });

   }
}



module.exports = {
  registerUser,
  loginUser,
  changePassword
};
