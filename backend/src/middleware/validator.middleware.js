const reqBodyValidator = (schema) => {
    return async (req, res, next) => {
        try{
            const data = req.body 

            await schema.validateAsync(data, {abortEarly: false})

            next()
        }catch(error){
            next(error)
        }
    }
}

module.exports = {
    reqBodyValidator
}