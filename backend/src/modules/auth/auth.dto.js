const Joi = require('joi')

const RegisterDTO = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).required(),
    phone: Joi.string().min(10).max(10).optional(),
})

const LoginDTO = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

module.exports = {
    RegisterDTO,
    LoginDTO
}