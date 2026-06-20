import {sendResponse} from '../lib/helper/send_response.js'
import jwt from 'jsonwebtoken'
import {envConfig} from '../lib/configs/env_config.js'
import UserModal from '../modals/user_modal.js'
export const AuthorizeUser = async(req,res,next) => {
    try {
        const token = req?.cookies?.access_token || req?.headers?.authorization?.split(' ')[1]
        if (!token){
            return sendResponse(res,401,true,{general:"Access Denied. No token provided"},null)
        }
        let decoded;
        try {
            decoded = jwt.verify(token, envConfig.MART_SECRET)
        } catch(error) {
            return sendResponse(res,401,true,{general:"Invalid access token"},null)
        }
        // console.log(decoded);
        const user = await UserModal.findById(decoded.id).select('-password -__v');
        // console.log(user);
        if (!user) {
            return sendResponse(res, 401, true, { general: 'User not found' }, null);
        }
        req.user = user;
        // console.log(req);

        next()
    } catch (error) {
        return sendResponse(res,500,true,{ general: `Something went wrong ${error.message}` },null)   
    }
}

export const AuthorizeAdminMiddleware = async(req,res,next) => {
    if (req.user?.role != "admin"){
        return sendResponse(res,403,true,{general:"Access denied!"},null)
    }
    next()
}