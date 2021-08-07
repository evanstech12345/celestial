const User = require('../model/User')
const Joi = require('@hapi/joi');
const router = require('express').Router()
const bcrypt = require('bcryptjs')
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
        name: req.body.name,
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
router.post('/login', (req, res) => {
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send('Email, name, or password does not exist')
    const emailExist = User.findOne({
        email: req.body.email
    })
    if(!nameValid) return res.status(400).send('Email, name, or password does not exist')
    const nameValid = User.findOne({
        name: req.body.name
    })
    if(!passwordValid) return res.status(400).send('Email, name, or password does not exist')
    const passwordValid = User.findOne({
        password: hashPassword
    })
})


module.exports = router;