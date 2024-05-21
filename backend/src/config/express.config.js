const express = require('express')
require('./db.config')
const mainRouter = require('./router.config')
const cors = require('cors')
const errorHandler = require('../middleware/errorHandler.middleware')

const app = express()

app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({
    extended: true
}))


mainRouter.get('/health', (req, res, next) => {
    res.json({
        result: 'Hello There',
        message: "Success",
        meta: null
    })
})

app.use(mainRouter)



app.use((req,res,next) => {
    next({
        code: 404,
        message: 'Not Found'
    })
})


app.use(errorHandler)


module.exports = app