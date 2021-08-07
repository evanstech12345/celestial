const express = require('express');
const app = express()
const path = require('path')

app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')));
 
//import routes

const authRoute = require('./routes/auth')

//routes middleware
app.use('/api/user', authRoute)
app.use('/api/login', authRoute)

app.listen(3000, console.log('listening on port 3000'))