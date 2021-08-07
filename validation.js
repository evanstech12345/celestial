const Joi = require('@hapi/joi');
const express = require('express')


const registerValidation = data => {
    const schema = Joi.object({
        password: Joi.string().min(6).required(),
        email: Joi.string().required().email(),
        name: Joi.string().required()
    })
    //validate the data before make user
    const {error} = schema.validate(req.body);
    if(error) return res.status(400)
}

module.exports.registerValidation = registerValidation