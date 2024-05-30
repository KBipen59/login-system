const Joi = require('joi')

const AddTodoDTO = Joi.object({
    title: Joi.string().min(2).max(50).required(),
    description : Joi.string().max(150).allow(null,"").optional().default(""),
    status: Joi.string().pattern(/^(pending|in_progress|in_review|complete)$/).default('pending')
})

const UpdateTodoDTO = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().min(2).max(50).required(),
    description : Joi.string().max(150).allow(null,"").optional().default(""),
    status: Joi.string().pattern(/^(pending|in_progress|in_review|complete)$/).default('pending').required()
})


module.exports = {
    AddTodoDTO,
    UpdateTodoDTO
}