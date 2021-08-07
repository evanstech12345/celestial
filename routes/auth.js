const User = require('../model/User')
const Joi = require('@hapi/joi');
const router = require('express').Router()
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

    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try{
        const savedUser = await user.save()
        res.send(savedUser)
    } catch(err) {
        res.status(400).send(err)
    }
})

router.post('/login', (req, res) => {
    res.send('Login')
})


module.exports = router;