import joi from 'joi'

const registerValidation = joi.object({
    name: joi.string().min(3).max(255).required()
    .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 3 characters',
            'any.required': 'Name is required',
        }),
    email: joi.string().email({ minDomainSegments: 2, tlds: {allow:['com', 'net']} }).required()
    .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
    password: joi.string().min(8).required()
    .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters',
            'any.required': 'Password is required',
        }),
    confirmPassword: joi.string()
    .valid(joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm Password is required',
      'any.required': 'Confirm Password is required',
    }),
}) 

const loginValidation = joi.object({
     email: joi.string().email({ minDomainSegments: 2, tlds: {allow:['com', 'net']} }).required()
    .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),
    password: joi.string().min(8).required()
    .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters',
            'any.required': 'Password is required',
        }),
   
})
export {registerValidation,loginValidation}