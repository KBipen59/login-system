const TodoModel = require("./todo.model")

class TodoService {
    addTodo = async (todo) => {
        try{
            const newTodo = await TodoModel.create(todo)
            return newTodo
        }catch (err) {
            throw err
        }
    }

    getMyTodos = async (filter, sort) => {
        try{
            const myTodos = await TodoModel.find(filter).sort(sort)
            return myTodos
        }catch(err) {
            throw err
        }
    }

    getTodo = async (id) => {
        try{ 
            const todo = await TodoModel.findById(id)
            return todo
        }catch(err) {
            throw err
        }
    }

    deleteTodo = async (id) => {
        try{
            const todo = await TodoModel.findByIdAndDelete(id)
            return todo
        }catch (err) {
            throw err
        }
    }

    updateTodo = async (id, data) => {
        try{
            const updatedTodo = await TodoModel.findByIdAndUpdate(id,{$set: data}, {
                new: true
            })
            return updatedTodo
        }catch (err) {
            throw err
        }
    }
}

const todoSvc = new TodoService()

module.exports = todoSvc