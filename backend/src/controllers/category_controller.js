import {sendResponse} from '../lib/helper/send_response.js'
import {CategoryModal} from '../modals/category_modal.js'
import mongoose from 'mongoose'
export const getallcategoryController = async (req,res) => {
    try {
        const categories = await CategoryModal.find()
        return sendResponse(res,200,false,null,
            {categories,message:"Categories fetched successfully"})
 
    } catch (error) {
        return sendResponse(res,500,true,{ general: `Something went wrong ${error.message}` },null)
        
    }
}

export const addcategoryController = async(req,res) => {
    try {
        const {name,description} = req.body
        const lowerName = name.toLowerCase().trim()
        // console.log(name.toLowerCase());
        
        const existingCategory = await CategoryModal.findOne({
            name:lowerName
        })
        if (existingCategory) {
            return sendResponse(res,400,true,{general:"Category with this name already exists"},null)
        } 
        
        await CategoryModal.create({
            name,description
        })
        return sendResponse(res,201,false,null,{message:"Category added successfully"})
    } catch (error) {
        return sendResponse(res,500,true,{ general: `Something went wrong ${error.message}` },null)
        
    }
}

export const updatecategoryController = async(req,res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, true, { general: "Invalid Category Id" }, null);
        }
        
        
        const {name,description} = req.body
        const lowerName = name.toLowerCase().trim()
        // console.log(name.toLowerCase());
        
        const existingCategory = await CategoryModal.findOne({
            _id:{$ne:id},name:lowerName //$ne: not equal ya id ko chor kr sari id ma name check kro same to ni ha
        })
        if (existingCategory) {
            return sendResponse(res,400,true,{general:"Category with this name already exists"},null)
        } 
        const updateCategory = await CategoryModal.findByIdAndUpdate(
            id,{name:lowerName,description},{new:true,runValidators:true}
        )

        if (!updateCategory) {
            return sendResponse(res,404,true,{general:"Category not found"},null)
        }
        return sendResponse(res,200,false,null,{message:"Category updated successfully",category:updateCategory})
    } catch (error) {
        return sendResponse(res,500,true,{ general: `Something went wrong ${error.message}` },null)
        
    }
}

export const getsinglecategoryController = async(req,res)=>{
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, true, { general: "Invalid Category Id" }, null);
        }

        const singleCategory = await CategoryModal.findById(id)
        
    if (!singleCategory) { return sendResponse(res, 404, true, { general: "Category not found" }, null) }

     return sendResponse(res,200,false,null,{message:"Category fetched successfully",category:singleCategory})
    } catch (error) {
        
        return sendResponse(res,500,true,{ general: `Something went wrong ${error.message}` },null)
    }
}

export const deletesinglecategoryController = async(req,res)=>{
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, true, { general: "Invalid Category Id" }, null);
        }

        const deleteCategory = await CategoryModal.findByIdAndDelete(id)
        
    if (!deleteCategory) { return sendResponse(res, 404, true, { general: "Category not found" }, null) }

     return sendResponse(res,200,false,null,{message:"Category deleted successfully"})
    } catch (error) {
        
        return sendResponse(res,500,true,{ general: `Something went wrong ${error.message}` },null)
    }
}