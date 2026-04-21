const Image = require('../models/Image')
const fs = require('fs');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelpers')
const cloudinary = require('../config/cloudinary')


const imageUploadController = async(req, res)=>{
      try{
           if(!req.file){
               return res.status(400).json({
                 success: false,
                 message: 'file is required, please upload a file'
               })
           }
           //upload to cloudinary
           const {url, publicId} = await uploadToCloudinary(req.file.path)

           //store the url and pulicId alongside with uploaded userId in the database
           const newlyUploadImage = new Image({
             url,
             publicId,
             uploadedBy: req.userInfo.id
           })

        const saveImage = await newlyUploadImage.save()
         
        //delete image from local storage
        fs.unlinkSync(req.file.path)

        if(saveImage){
            res.status(201).json({
                success: true,
                message: 'image uploaded successfully!',
                image: newlyUploadImage
            })
        }

      }catch(err){
         res.status(500).json({
            success: false,
            message: err.message
         })
      }
}


const fetchAllImagesController = async(req, res)=>{
   try{
      const allImage = await Image.find({})
      if(allImage){
          res.status(200).json({
             success: true, 
             data: allImage
          })
      }


   }catch(error){
     res.status(500).json({
            success: false,
            message: 'something went wrong, please try again'
         })
   }

}


const deleteImageController = async(req, res)=>{
  try{
      const getCurrentIdOfImage = req.params.id;

      const userId = req.userInfo.id

      const image = await Image.findById(getCurrentIdOfImage)

      if(!image){
         return res.status(404).json({
            success: false,
            message: 'message not found!'
         })
      }


      if(image.uploadedBy.toString() !== userId){
         return res.status(403).json({
           success: false,
           message: 'you are not authorized to delete this image!'
         })
      }


     //delete the image from cloudinary....
      if(image.publicId){
         await cloudinary.uploader.destroy(image.publicId)
      }

     //delete the image in mongodb database
     await Image.findByIdAndDelete(getCurrentIdOfImage)

     return res.status(200).json({
        success: true,
        message: 'image has been deleted successfully!'
     })






      

  }catch(error){
        console.log(error)
         res.status(500).json({
           success: false,
           message: error.message
         })
    
  }

}


module.exports = {imageUploadController, 
  fetchAllImagesController,
  deleteImageController
}