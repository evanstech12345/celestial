const Joi = require('@hapi/joi');
const express = require('express')


const registerValidation = data => {
    const schema = Joi.object({
        password: Joi.string().min(6).required(),
        email: Joi.string().required().email(),
        name: Joi.string().required()
    })
    //validate the data before make user
    return schema.validate(data)
}
const loginValidation = data => {
    const schema = Joi.object({
        password: Joi.string().min(6).required(),
        // email: Joi.string().required().email(),
        name: Joi.string().required()
    })
    //validate the data before make user
    return schema.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation