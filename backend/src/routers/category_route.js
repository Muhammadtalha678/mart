import express from 'express'
import { addcategoryController, deletesinglecategoryController, getallcategoryController, getsinglecategoryController, updatecategoryController } from '../controllers/category_controller.js'
import { validateRequest } from '../middlewares/validate_request_middleware.js'
import { categoryValidation } from '../lib/validations/category_validation.js'

const router = express.Router()

router.get('/categories',getallcategoryController)
router.post('/categories',validateRequest(categoryValidation),addcategoryController)
router.put('/categories/:id',validateRequest(categoryValidation),updatecategoryController)
router.get('/categories/:id',getsinglecategoryController)
router.delete('/categories/:id',deletesinglecategoryController)
export default router