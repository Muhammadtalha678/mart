import joi from 'joi'
const categoryValidation = joi.object({
      name: joi.string().min(3).max(255).required()
         .messages({
                 'string.empty': 'Name is required',
                 'string.min': 'Name must be at least 3 characters',
                 'string.max': 'Name cannot exceed 255 characters',
                 'any.required': 'Name is required',
             }),
      description: joi.string().min(10).max(255).required()
         .messages({
                 'string.empty': 'Description is required',
                 'string.min': 'Description must be at least 10 characters',
                 'string.max': 'Name cannot exceed 255 characters',
                 'any.required': 'Description is required',
             })
})

export {categoryValidation}