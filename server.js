const express = require('express');
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

app.set('view-engine', 'ejs')
app.use(express.static(path.join(__dirname, '/front/public')));
app.use(express.static(path.join(__dirname, '/front/public/images')));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
dotenv.config();

//connect to db
const UURI = mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true ,  useNewUrlParser: true }, () => {
console.log('db is connected')
})


//import routes
const authRoute = require('./routes/auth')

// get routes
app.get('/register', (req, res) => {
    res.render('/opt/homebrew/Caskroom/miniforge/base/envs/celesial/Celesial/front/view/signup.ejs')
})
app.get('/login', (req, res) => {
    res.render('/opt/homebrew/Caskroom/miniforge/base/envs/celesial/Celesial/front/view/login.ejs')
})
app.get('/', (req, res) => {
    res.render("/opt/homebrew/Caskroom/miniforge/base/envs/celesial/Celesial/front/view/index.ejs")
})
app.get('/about', (req, res) => {
    res.render("/opt/homebrew/Caskroom/miniforge/base/envs/celesial/Celesial/front/view/aboutUs.ejs")
})
app.get('/articles', (req, res) => {
    res.render("/opt/homebrew/Caskroom/miniforge/base/envs/celesial/Celesial/front/view/articles.ejs")
})

//routes middleware
app.use('/api/user', authRoute)
app.use('/api/login', authRoute)




app.listen(3000, console.log('listening on port 3000'))