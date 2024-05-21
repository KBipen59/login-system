const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 15
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 15
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String 
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    activationToken: String
},{
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
})

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel