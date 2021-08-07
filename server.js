const express = require('express');
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname, '/front/public')));
app.use(express.static(path.join(__dirname, '/front/public/images')));
app.use(express.json())
dotenv.config();

//connect to db
const UURI = mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true ,  useNewUrlParser: true }, () => {
console.log('db is connected')
})


//import routes
const authRoute = require('./routes/auth')

//get routes
app.get('/register', (req, res) => {
    res.render('/opt/homebrew/Caskroom/miniforge/base/envs/celesial/Celesial/front/view/signup.ejs')
})
app.get('/login', (req, res) => {
    res.render('/opt/homebrew/Caskroom/miniforge/base/envs/celesial/Celesial/front/view/login.ejs')
})

//routes middleware
app.use('/api/user', authRoute)
app.use('/api/login', authRoute)
app.use('/api/register', authRoute)



app.listen(3000, console.log('listening on port 3000'))