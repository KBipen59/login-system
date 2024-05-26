const Joi = require("joi")


const errorHandler = (err, req, res, next) => {
    let statusCode = err.code || 500
    let data = err.data || null
    let msg = err.message || 'Server Error'

    // console.log(err)

    if(err instanceof Joi.ValidationError){
        statusCode = 422
        msg = "Validation Failed",
        data = {}

        const errDetails = err.details

        if(Array.isArray(errDetails)){
            errDetails.map((errObj) => {
                data[errObj.context.label] = errObj.message
            })
        }
    }

    res.status(statusCode).json({
        result: data,
        message: msg,
        meta: null
    })
}


module.exports = errorHandler