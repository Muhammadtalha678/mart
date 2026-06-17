import UserModal from "../modals/user_modal.js"
import bcrypt from 'bcrypt'
import {sendResponse} from "../lib/helper/send_response.js";
import {accessToken} from '../lib/tokens/generate_token.js'

export const registerController = async(req,res) => {
    try {
        let {name,email,password} = req.body
        
        const alreadyRegister = await UserModal.findOne({email})
        if (alreadyRegister) {
            return sendResponse(res,409,true,{email:"User already registered"},null)
        }

        const hashPassword = await bcrypt.hash(password, 10)
        password = hashPassword

        await UserModal.create({
            name,email,password
        })
        return sendResponse(res,200,false,{},{message:"User Registered Succesfully."})
        
    } catch (error) {
        
        return sendResponse(res,500,true,{ general: error.message },null)
    }
}
export const loginController = async(req,res) => {
    try {
        let {email,password} = req.body
         // find user
        const user = await UserModal.findOne({email})
        if (!user) {
            return sendResponse(res,409,true,{email:"User is not registered"},null)
        }
        const isPasswordValid = await bcrypt.compare(password,user.password)
         if (!isPasswordValid) return sendResponse(res, 401, true, { email: "Invalid email or password" }, null);

         const access_token = accessToken({id:user._id,email:user.email,role:user.role})
        // console.log(access_token);
        
         const data = {
            name:user.name,
            email:user.email,
            accessToken:access_token
        }
       return sendResponse(res,200,false,{},{...data,message:"User Login Successfully"})
    } catch (error) {
        
        return sendResponse(res,500,true,{ general: error.message },null)
    }
}