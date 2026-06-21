import express from 'express'
import { validateRequest } from '../middlewares/validate_request_middleware.js'
import { AuthorizeUser } from '../middlewares/authorize_middleware.js'
import { loginValidation, registerValidation } from '../lib/validations/auth_validation.js'
import { loginController, registerController, logoutController } from '../controllers/auth_controller.js'


const router = express.Router()

router.post('/register',validateRequest(registerValidation),registerController)
router.post('/login',validateRequest(loginValidation),loginController)
router.post('/logout',AuthorizeUser,logoutController)

export default router