const authSvc = require("./auth.service")
const mailSvc = require("../../services/mail.service")
const JWT = require("jsonwebtoken")
const Joi = require('joi')
const bcrypt = require('bcryptjs')

const emailSchema = Joi.object({email: Joi.string().email().required()})

class AuthController {
    register = async (req, res, next) => {
        try {
            const data = authSvc.transformData(req)

            const existingUser = await authSvc.findOne({email: data.email})

            if(existingUser){
                throw {code: 409, message: "User with this email already exists"}
            }

            const user = await authSvc.create(data)

            await mailSvc.sendEmail(
                user.email,
                "Activate your Account!",
                `Dear ${user.firstName} ${user.lastName} <br/>
                <p>You have registered your account with username <strong>${user.firstName} ${user.lastName}</strong>.</p>
                <p>Please click the link below or copy and paste the url in browser to activate your account:</p>
                <a href="${process.env.FRONTEND_URL}/activation/?token=${user.activationToken}">
                    Click here
                </a>
                <p>Regards,</p>
                <p>${process.env.SMTP_FROM}</p>
                <p><small><em>Please do not reply to this email via any mail service.</em><small></p>
                `
            )
            
            res.status(201).json({
                result: {},
                message: 'Register Success',
                meta: null
            })
        } catch (error) {
            next(error)
        }
    }

    activate = async (req, res, next) => {
        try{
            const {token} = req.params 

            const {email} = JWT.verify(token, process.env.ACTIVATION_SECRET)

            const user = await authSvc.findOne({email})

            if(!user){
                throw {code: 404, message: "user not found"}
            }

            const updatedUser = await authSvc.updateUser(email, {
                status: "active",
                activationToken: null
            })

            res.status(200).json({
                result: {},
                message: "Your account has been activated, your can now login to continue.",
                meta: null
            })
        }catch(error){
            next(error)
        }
    }

    resendActivationLink = async (req, res, next) => {
        try{
            const email = await emailSchema.validateAsync({email: req.body.email}, {abortEarly: false})

            const user = await authSvc.findOne(email)

            if(!user){
                throw {code: 404, message: "User not found"}
            }

            user.activationToken = JWT.sign({email: email}, process.env.ACTIVATION_SECRET, {
                expiresIn: '5m'
            })

            await user.save()

            await mailSvc.sendEmail(
                user.email,
                "Activate your Account!",
                `Dear ${user.firstName} ${user.lastName} <br/>
                <p>You have registered your account with username <strong>${user.firstName} ${user.lastName}</strong>.</p>
                <p>Please click the link below or copy and paste the url in browser to activate your account:</p>
                <a href="${process.env.FRONTEND_URL}/activate/${user.activationToken}">
                    Click here
                </a>
                <p>Regards,</p>
                <p>${process.env.SMTP_FROM}</p>
                <p><small><em>Please do not reply to this email via any mail service.</em><small></p>
                `
            )

            res.status(200).json({
                result: {},
                message: "Successfully send activation link to your mail",
                meta: null
            })
        }catch(error){
            next(error)
        }
    }

    login = async (req, res, next) => {
        try{
            const {email, password} = req.body 

            const user = await authSvc.findOne({email})

            if(!user){
                throw {code: 422, message: "email or password is incorrect."}
            }

            const isMatchingPassword = bcrypt.compareSync(password, user.password)

            if(!isMatchingPassword){
                throw {code: 422, message: "email or password is incorrect."}
            }

            const {password: hash, ...userData} = user

            const accessToken = JWT.sign({user: userData}, process.env.ACCESS_SECRET, {
                expiresIn: "30m"
            })

            res.status(200).json({
                result: {userData,accessToken},
                message: "Logged in successfully",
                meta: null
            })
        }catch (error) {
            next(error)
        }
    }
}


const authCtrl = new AuthController()


module.exports = authCtrl