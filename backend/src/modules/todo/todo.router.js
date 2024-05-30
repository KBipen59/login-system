const todoCtrl = require('./todo.controller')
const { AddTodoDTO, UpdateTodoDTO } = require('./todo.dto')
const auth = require('../../middleware/auth.middleware')
const {reqBodyValidator} = require('../../middleware/validator.middleware')

const router = require('express').Router()


router.route('/')
    .post(auth, reqBodyValidator(AddTodoDTO) ,todoCtrl.addTodo)
    .get(auth, todoCtrl.getAllTodo)
    .delete(auth, todoCtrl.deleteTodo)
    .put(auth, reqBodyValidator(UpdateTodoDTO), todoCtrl.updateMyTodo)

module.exports = router