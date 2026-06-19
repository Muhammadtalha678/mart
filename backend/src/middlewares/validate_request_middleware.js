// import { sendResponse} from "../lib/helper/send_response.js"

// export const validateRequest = (validationSchema) => async(req, res, next) => {
//     const { error } = await validationSchema.validateAsync(req.body, { abortEarly: false })
//     console.log("error",error);
    
//     if (error) {
//          // Transform Joi error details to field-wise messages
//         const fieldErrors = {};
//         error.details.forEach(detail => {
//             const field = detail.path[0] //get error name
//             if (!fieldErrors[field]) {
//                 fieldErrors[field] = detail.message
//             }
//         });
//         return sendResponse(res,400,true,fieldErrors,null)
//     }
//     next()
// }

import { sendResponse } from "../lib/helper/send_response.js";

export const validateRequest = (validationSchema) => async (req, res, next) => {
    try {
        // FIXED: Using validateAsync with await handles both sync rules and .external() database checks
        const value = await validationSchema.validateAsync(req.body, {
             abortEarly: false,
             context:{productId:req.params.id} 
            });
        
        // Joi can mutate and sanitize data (like trimming strings), so assign it back to req.body
        req.body = value; 
        
        next();
    } catch (error) {
        // If it's a Joi validation error, it will contain a 'details' array
        if (error.isJoi || error.details) {
            const fieldErrors = {};
            error.details.forEach(detail => {
                const field = detail.path[0]; // Get field name
                if (!fieldErrors[field]) {
                    fieldErrors[field] = detail.message;
                }
            });
            return sendResponse(res, 400, true, fieldErrors, null);
        }
        
        // Pass any unexpected system errors (like DB connection failure) to your global error handler
        next(error);
    }
};
