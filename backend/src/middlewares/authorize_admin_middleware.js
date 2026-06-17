import {sendResponse} from '../lib/helper/send_response.js'
export const AuthorizeAdminMiddleware = async(req,res,next) => {
    if (req.user?.role != "admin"){
        return sendResponse(res,403,true,{general:"Access denied!"},null)
    }
}