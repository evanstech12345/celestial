if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express');
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const User = require('./model/User')
const Joi = require('@hapi/joi');
// const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')
// const passport = require('passport')
// const flash = require('express-flash')
// const session = require('express-session')
// const initilizePassport = require('./passport.config')
// initilizePassport(passport,
//     email => users.find(user => user.email === email)
// )

app.set('view engine', 'ejs')
// app.set('views', 'view')
app.use(express.static(path.join(__dirname, '/front/public')));
app.use(express.static(path.join(__dirname, '/front/public/images')));
app.use(express.json())
// app.use(express.urlencoded({ extended: false }))
// app.use(flash())
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
// }))
// app.use(passport.initialize())
// app.use(passport.session)
dotenv.config();

//connect to db
const UURI = mongoose.connect(process.env.DB_CONNECT, { useUnifiedTopology: true ,  useNewUrlParser: true }, () => {
console.log('db is connected')
})


//import routes
// const authRoute = require('./routes/auth')

// get routes

// var bodyParser = require('body-parser')
const {registerValidation, loginValidation} = require('./validation');
// const passport = require('passport');

app.get('/register', (req, res) => {

res.render(__dirname + "/front/view/signup")
})
app.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if(error) return res.status(400)


    //Check if the user is already in the db
    const emailExist = await User.findOne({
        email: req.body.email
    })
    if(emailExist) return res.status(400).send('email already exists')
    // const nameExist = await User.findOne({
        // name: req.body.name
    // })
    // if(nameExist) return res.status(400).send('name already exists')

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)


    //create a new user
    const user = new User({
        email: req.body.email,
        password: hashPassword
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
        res.redirect('/login')
    } catch(err) {
        res.status(400).send(err)
    }
})

//login
app.get('/login', (req, res) => {
    res.render(__dirname + "/front/view/login")
})
app.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email or password is not found')
    //if password and name is correct

    // const validName = await User.findOne({ name: req.body.name })
    // if (!validName) return res.status(400).send('Email, name, or password is not found')
    //if password and name is correct
    
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Email or password is not found')

    //Create and assign a token 
    // const token = jwt.sign(({_id: user._id}), process.env.TOKEN_SECRET)

    // res.header(('auth-token', token).send(token))
    console.log('logged in')
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

// //routes middleware
// app.use('/api/user', authRoute)
// app.use('/api/login', authRoute)




app.listen(3000, console.log('listening on port 3000'))