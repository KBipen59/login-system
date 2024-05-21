const UserModel = require('./auth.model')
const bcrypt = require('bcryptjs')
const { generateRandomString } = require('../../utilities/helper')
const JWT = require('jsonwebtoken')

class AuthService {
    transformData = (req) => {
        const data = req.body

        data.password = bcrypt.hashSync(data.password, 10)
        data.status = 'inactive'

        data.activationToken = JWT.sign({email: data.email}, process.env.ACTIVATION_SECRET, {
            expiresIn: '5m'
        })

        return data
    }

    findOne = async (filter) => {
        try {
            const user = await UserModel.findOne(filter).lean()
            return user
        } catch (error) {
            throw error
        }
    }

    create = async (data) => {
        try {
            const user = await UserModel.create({...data})
            return user
        } catch (error) {
            throw error
        }
    }

    updateUser = async (filter, data) => {
        try{
            const user = await UserModel.findOneAndUpdate(filter, {$set: data}, {new: true})

            return user
        }catch(error) {
            throw error
        }
    }
}

const authSvc = new AuthService()

module.exports = authSvc