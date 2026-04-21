const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const uploadImageMiddleware = require('../middleware/uploadImageMiddleware')
const {imageUploadController, fetchAllImagesController, deleteImageController} = require('../controllers/imageController')
const router = express.Router()


router.post('/upload',
     authMiddleware,
     adminMiddleware,
     uploadImageMiddleware.single('image'),
     imageUploadController
    )

router.get('/getImages', authMiddleware, fetchAllImagesController)
router.delete('/:id', authMiddleware, adminMiddleware, deleteImageController)
   


module.exports = router;