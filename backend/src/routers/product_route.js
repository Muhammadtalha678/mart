import express from 'express'
import {AuthorizeAdminMiddleware,AuthorizeUser} from '../middlewares/authorize_middleware.js'
import {uploadImages} from '../middlewares/uploadimage_middleware.js'
import {addproductController, deletesingleproductController, getallproductController,getsingleproductController} from '../controllers/product_controller.js'
import { validateRequest } from '../middlewares/validate_request_middleware.js'
import { productValidation } from '../lib/validations/product_validation.js'
const router = express.Router()
router.get('/products',getallproductController)
router.get('/products/:id',getsingleproductController)

router.delete('/products/:id',AuthorizeUser,AuthorizeAdminMiddleware,deletesingleproductController)
router.post('/products',AuthorizeUser,AuthorizeAdminMiddleware,uploadImages,
    validateRequest(productValidation),addproductController)

export default router