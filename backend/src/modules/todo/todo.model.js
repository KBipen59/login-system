const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    description: {
        type: String,
        min: 2,
        max: 150,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'in_progress', 'in_review' ,'complete'],
        default: 'pending'
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
})


const TodoModel = mongoose.model("Todo", TodoSchema)

module.exports = TodoModel