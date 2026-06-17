import express from 'express'
import { addcategoryController, deletesinglecategoryController, getallcategoryController, getsinglecategoryController, updatecategoryController } from '../controllers/category_controller.js'
import { validateRequest } from '../middlewares/validate_request_middleware.js'
import { categoryValidation } from '../lib/validations/category_validation.js'
import { AuthorizeAdminMiddleware, AuthorizeUser } from '../middlewares/authorize_middleware.js'

const router = express.Router()

router.get('/categories',getallcategoryController)
router.post('/categories',AuthorizeUser,AuthorizeAdminMiddleware,validateRequest(categoryValidation),addcategoryController)
router.put('/categories/:id',AuthorizeUser,AuthorizeAdminMiddleware,validateRequest(categoryValidation),updatecategoryController)
router.get('/categories/:id',getsinglecategoryController)
router.delete('/categories/:id',AuthorizeUser,AuthorizeAdminMiddleware,deletesinglecategoryController)
export default router