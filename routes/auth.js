const User = require('../model/User')
const router = require('express').Router()
// var bodyParser = require('body-parser')

//VALIDATION
const Joi = require('@hapi/joi');

const schema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().required().email(),
    name: Joi.string().required()
})

router.post('/register', async (req, res) => {

    //validate the data before make user
    const validation = schema.validate(req.body);
    res.send(validation)

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