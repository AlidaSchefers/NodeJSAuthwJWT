const express = require('express')
const app = express()
const dotenv = require('dotenv')
const mongoose = require('mongoose')

//Import routes
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

//connect to DB
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true, useUnifiedTopology: true }, 
    () => console.log('connected to DB')
)

//Middleware
app.use(express.json()) //sorry, what is this about?
//"now we can send post requests"

//Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(3000, () => console.log('Server running'))