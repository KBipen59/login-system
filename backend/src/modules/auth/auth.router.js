const authCtrl = require('./auth.controller')
const { reqBodyValidator } = require('../../middleware/validator.middleware')
const { RegisterDTO, LoginDTO } = require('./auth.dto')

const router = require('express').Router()

router.post('/register', reqBodyValidator(RegisterDTO) , authCtrl.register)
router.get('/activation/:token', authCtrl.activate)
router.put('/resend-activation-link', authCtrl.resendActivationLink)
router.post('/login', reqBodyValidator(LoginDTO), authCtrl.login)


module.exports = router