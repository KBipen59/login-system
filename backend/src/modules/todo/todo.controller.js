const todoSvc = require("./todo.service")

class TodoController {
    addTodo = async (req, res, next) => {
        try{
            const {title, description} = req.body 
            const authUser = req.authUser

            const todo = await todoSvc.addTodo({
                title,
                description,
                userId: authUser._id
            })

            res.status(200).json({
                result: todo,
                message: "Todo create successfully",
                meta: null
            })
        }catch (error){
            next(error)
        }
    }

    getAllTodo = async (req, res, next) => {
        try{
            const authUser = req.authUser
            const status = req.query.status
            const createdAt = req.query.createdAt
            const title = req.query.title

            let filter = {}
            let sort = {}

            filter = {
                userId: authUser._id
            }

            if(status) {
                let STATUS = /^(pending|in_progress|in_review|complete)$/
                if(!status.match(STATUS)){
                    throw {code: 400, message: `status must contain one of these: ${STATUS}`}
                }
                filter = {
                    ...filter,
                    status: status
                }
            }

            if(createdAt) {
                let STATUS = /^(asc|desc)$/
                if(!createdAt.match(STATUS)){
                    throw {code: 400, message: `createdAt value must be either asc or desc`}
                }
                sort = {
                    ...sort,
                    createdAt: createdAt
                }
            }

            if(title) {
                let STATUS = /^(asc|desc)$/
                if(!title.match(STATUS)){
                    throw {code: 400, message: `title value must be either asc or desc`}
                }
                sort = {
                    ...sort,
                    title: title
                }
            }

            const allTodos = await todoSvc.getMyTodos(filter, sort)

            res.status(200).json({
                result: allTodos,
                message: "Your Todo List",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    deleteTodo = async (req, res, next) => {
        try{
            const { id } = req.body

            if(!id) {
                throw {code: 400, message: "id is required"}
            }

            const authUser = req.authUser

            const todo = await todoSvc.getTodo(id)

            if(!todo) {
                throw {code: 404, message: "todo doesnot exists"}
            }

            if(todo.userId.toString() !== authUser._id.toString()){
                throw {code: 401, message: "This todo does not belong to you"}
            }

            await todoSvc.deleteTodo(id)

            res.status(200).json({
                result: null,
                message: "Todo has been deleted",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }

    updateMyTodo = async (req, res, next) => {
        try{
            const {title, description, status, id} = req.body 
            const authUser = req.authUser

            const todo = await todoSvc.getTodo(id)

            if(!todo) {
                throw {code: 404, message: "todo doesnot exists"}
            }

            if(todo.userId.toString() !== authUser._id.toString()){
                throw {code: 401, message: "This todo does not belong to you"}
            }

            const updatedTodo = await todoSvc.updateTodo(id, {
                title,
                description,
                status
            })

            res.status(200).json({
                result: updatedTodo,
                message: "Todo has been updated successfully",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    } 
}


const todoCtrl = new TodoController()


module.exports = todoCtrl