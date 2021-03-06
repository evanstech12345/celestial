const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// var bodyParser = require('body-parser')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024, 
    }
})



module.exports = mongoose.model('User', userSchema)