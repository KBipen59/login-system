const mainRouter = require('express').Router()
const authRouter = require('../modules/auth/auth.router')
const todoRouter = require('../modules/todo/todo.router')



mainRouter.use('/api/v1/auth', authRouter)
mainRouter.use('/api/v1/todo', todoRouter)

module.exports = mainRouter