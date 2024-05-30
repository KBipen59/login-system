require("dotenv").config()
const jwt = require('jsonwebtoken')
const authSvc = require("../modules/auth/auth.service")


const auth = async (req, res, next) => {
    try {

        let token = req.headers['authorization'] || null 

        if(!token){
            next({code: 401, message: "Token required"})
        }

        token = token.split(" ").pop()

        if(!token){
            next({code: 401, message: "Token required"})
        }

        const tokenData = jwt.verify(token, process.env.ACCESS_SECRET)

        
        const userDetail = await authSvc.findOne({_id: tokenData.user})
        

        if(!userDetail){
            next({code: 401, message: "User does not exists!"})
        }

        req.authUser = userDetail

        next()


    } catch (error) {
        console.log("Exception", error) 
        next({code: 401, message: "Unauthorized access"})
    }
}

module.exports = auth