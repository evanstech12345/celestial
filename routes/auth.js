const User = require('../model/User')
const Joi = require('@hapi/joi');
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const axios = require('axios')
// var bodyParser = require('body-parser')
const {registerValidation, loginValidation} = require('../validation')


router.post('/register', async (req, res) => {

    const { error } = registerValidation(req.body);
    if(error) return res.status(400)


    //Check if the user is already in the db
    const emailExist = await User.findOne({
        email: req.body.email
    })
    if(emailExist) return res.status(400).send('email already exists')
    const nameExist = await User.findOne({
        name: req.body.name
    })
    if(nameExist) return res.status(400).send('name already exists')

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
    } catch(err) {
        res.status(400).send(err)
    }
})

//login
router.post('/login', async (req, res) => {
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

})





module.exports = router;