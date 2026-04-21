
const mongoose = require('mongoose');

const connectToDatabase = async()=>{
    try{
         await mongoose.connect(process.env.MONGO_URI)
         console.log('database was connected successfully!')

    }catch(err){
        console.log('database connection failed')
        process.exit(1)

    }
}


module.exports = {connectToDatabase};



