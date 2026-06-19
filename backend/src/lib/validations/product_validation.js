import joi from 'joi';
import mongoose from 'mongoose';
import { ProductModal } from '../../modals/product_modal.js';
import { CategoryModal } from '../../modals/category_modal.js';

// Define the custom validator function
const objectIdValidator = async (value, helpers) => {
    const isMongooseId = mongoose.Types.ObjectId.isValid(value);
    let categoryExists = false;

    if (isMongooseId) {
        categoryExists = await CategoryModal.findById(value);
    }

    // FIXED: If either check fails, throw a native Joi validation error manually
    if (!isMongooseId || !categoryExists) {
        throw new joi.ValidationError(
            'ValidationError',
            [
                {
                    message: 'Invalid Category Id or Category does not exist.',
                    path: ['category_id'], // Maps it perfectly to your middleware's field selector
                    type: 'any.invalid',
                },
            ],
            value
        );
    }

    return value; // Returns the valid value if successful
};
const verifyProductExistingValidator = async(value,helpers) => {
    const productId = helpers.prefs?.context?.productId
    if (productId){
        const isMongooseId = mongoose.Types.ObjectId.isValid(productId);
        let productExists = false;

        if (isMongooseId) {
            productExists = await ProductModal.findById(productId);
        }
        if (!isMongooseId || !productExists) {
        throw new joi.ValidationError(
            'ValidationError',
            [
                {
                    message: 'Invalid Product Id or Product does not exist.',
                    path: ['id'], // Maps it perfectly to your middleware's field selector
                    type: 'any.invalid',
                },
            ],
            value
        );
    }
    }
    return value
}
const productNameExistsValidator = async (value, helpers) => {
    const lowerName = value.toLowerCase().trim()
    const productId = helpers.prefs?.context?.productId
    
    const query = {name:lowerName}
    if (productId){
        query._id = {$ne:productId}
    }
    const existingProduct = await ProductModal.findOne(query)

    // FIXED: If either check fails, throw a native Joi validation error manually
    if (existingProduct) {
        throw new joi.ValidationError(
            'ValidationError',
            [
                {
                    message: 'Product with this name already exists.',
                    path: ['name'], // Maps it perfectly to your middleware's field selector
                    type: 'any.invalid',
                },
            ],
            value
        );
    }

    return value; // Returns the valid value if successful
};

export const productValidation = joi.object({
  name: joi.string().min(3).max(255).required().external(verifyProductExistingValidator).external(productNameExistsValidator).messages({
    'string.base': 'Product name must be a text string',
    'string.empty': 'Product name is required',
    'string.min': 'Product name must be at least 3 characters long',
    'string.max': 'Product name cannot exceed 255 characters',
    'any.required': 'Product name is required'
  }),
  
  description: joi.string().required().messages({
    'string.base': 'Description must be a text string',
    'string.empty': 'Description is required',
    'any.required': 'Description is required'
  }),
  
  original_price: joi.number().positive().required().messages({
    'number.base': 'Original price must be a number',
    'number.positive': 'Original price must be a positive number',
    'any.required': 'Original price is required'
  }),
  
  selling_price: joi.number().positive().required().messages({
    'number.base': 'Selling price must be a number',
    'number.positive': 'Selling price must be a positive number',
    'any.required': 'Selling price is required'
  }),
  
  stock: joi.number().integer().min(0).required().messages({
    'number.base': 'Stock must be a number',
    'number.integer': 'Stock must be a whole number',
    'number.min': 'Stock cannot be negative',
    'any.required': 'Stock is required'
  }),
  
  category_id: joi.string().required().external(objectIdValidator).messages({
    'string.base': 'Category ID must be a text string',
    'string.empty': 'Category ID is required',
    'any.required': 'Category ID is required'
  })
});
