require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./database/database')

db.connectToDatabase()

const authRoutes = require('./routes/authRoute')
const homeRoutes = require('./routes/homeRoute')
const adminRoutes = require('./routes/adminRoute')
const uploadImageRoutes = require('./routes/imageRoutes')

const PORT = process.env.PORT || 3000


app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/image', uploadImageRoutes)
// app.use('/api/auth', authRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running at: ${PORT}`)
})
