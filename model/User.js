const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 20
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        max: 1024, 
    }
})


module.exports = mongoose.model('User', userSchema)