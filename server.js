const express = require('express');
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
dotenv.config();

//connect to db
const UURI = mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true ,  useNewUrlParser: true }, () => {
console.log('db is connected')
})


//import routes
const authRoute = require('./routes/auth')

//routes middleware
app.use('/api/user', authRoute)
app.use('/api/login', authRoute)



app.listen(3000, console.log('listening on port 3000'))