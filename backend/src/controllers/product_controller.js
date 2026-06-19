import { sendResponse } from "../lib/helper/send_response.js"
import { CategoryModal } from "../modals/category_modal.js"
import mongoose from 'mongoose'
import cloudinary from '../lib/configs/cloudinary_config.js'
import { ProductModal } from "../modals/product_modal.js"
import fs from 'fs'
import { extractPublicId} from "../lib/helper/extract_public_id.js"

export const getallproductController = async (req, res) => {
    try {
        const products = await ProductModal.find({},{__v:0}).populate('category_id','name');
        return sendResponse(res,200,false,null,{products,message:"Products fetched successfully"})
    } catch (error) {
        return sendResponse(res,500,true,{general:`Something went wrong ${error.message}`},null)
    }
} 

export const addproductController = async (req,res) => {
    let uploadedPublicIds= []
    let bannerImageLocalPath
    let detailImagesLocalPaths
    try {
        const files = req.files
        const {
            name,
            description,
            original_price,
            selling_price,
            stock,
            category_id
        } = req.body    
        
        // get the local paths
        bannerImageLocalPath = files.banner_image[0].path
        detailImagesLocalPaths = files.detail_images.map(file => file.path)
        
        // upload the banner image to cloudinary and get the public id and push in array
        const bannerUpload = await cloudinary.uploader.upload(
            bannerImageLocalPath,{folder:"mart"}
        )
        const bannerUploadPublicId = bannerUpload.public_id
        uploadedPublicIds.push(
            bannerUploadPublicId
        )
        
        // upload the detail images to cloudinary and get the public id and push in array
        const detailImagesUpload = await Promise.all(detailImagesLocalPaths.map(
            imageUrl => cloudinary.uploader.upload(imageUrl,{folder:"mart"})
        ))
        // // Unki IDs save karlein taake agar error aaye toh delete kar saken
        const detailImagesUploadPublicId = detailImagesUpload.map(u => u.public_id)
        uploadedPublicIds.push(
            ...detailImagesUploadPublicId
        )

        await ProductModal.create({
            name,
            description,
            original_price,
            selling_price,
            stock,
            category_id,
            banner_image: bannerUpload.secure_url,
            detail_images:detailImagesUpload.map(u => u.secure_url),
        }) 

        // delete the banner and details image from temp path save in local system
        if (fs.existsSync(bannerImageLocalPath)) fs.unlinkSync(bannerImageLocalPath)
        detailImagesLocalPaths.map(path => {
            if (fs.existsSync(path)) fs.unlinkSync(path)
            
        })
        console.log(uploadedPublicIds);
        
        return sendResponse(res, 200, false, null, {message: "Products added successfully" })
    } catch (error) {
        // agr error ajata ha save product krny ma db ka to phr banner or
        //  details image ki public id jo array ma save krwau thi hm dono ki public ids ko
        //  destroy krdain gy cloudinary sy 
        if(uploadedPublicIds.length > 0) {
            await Promise.all(
                uploadedPublicIds.map(id => cloudinary.uploader.destroy(id))
            )
        }
        // delete the banner and details image from temp path save in local system
        if (bannerImageLocalPath !== 0) {
            if (fs.existsSync(bannerImageLocalPath)) fs.unlinkSync(bannerImageLocalPath);
            
        }
        if (detailImagesLocalPaths.length > 0) {
            detailImagesLocalPaths.forEach(path => {
                if (fs.existsSync(path)) fs.unlinkSync(path);
            });
        }
        return sendResponse(res,500,true,{ general: `Something went wrong ${error.message}` },null)
                
    }
} 


export const getsingleproductController = async (req, res) => {
    try {
        const { id } = req.params
        
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, true, { general: "Invalid Product Id" }, null);
        }
        
        const product = await ProductModal.findById(id).populate('category_id','name')
        
        if (!product) { return sendResponse(res, 404, true, { general: "Product not found" }, null) }
        
        
        return sendResponse(res, 200, false, null, { message: "Product fetched successfully", product })
        
    } catch (error) {
        return sendResponse(res,500,true,{general:`Something went wrong ${error.message}`},null)
    }
}

export const deletesingleproductController = async(req,res) => {
    try {
        const { id } = req.params
        
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendResponse(res, 400, true, { general: "Invalid Product Id" }, null);
        }

        const deletedProduct = await ProductModal.findByIdAndDelete(id)
        console.log(deletedProduct);
        
        if (!deletedProduct) { return sendResponse(res, 404, true, { general: "Product not found of that Id" }, null) }
        
        if (deletedProduct.banner_image && deletedProduct.detail_images.length > 0) {
            const deleteDetailImagePromise = await Promise.all(
                [...deletedProduct.detail_images.map(imageUrl => {
                     const publicId = extractPublicId(imageUrl)
                     return cloudinary.uploader.destroy(publicId)   
                }),
                cloudinary.uploader.destroy(extractPublicId(deletedProduct.banner_image))
            ])

        }
        
        return sendResponse(res, 200, false, null, { message: "Product deleted successfully"})
        
    } catch (error) {
        return sendResponse(res,500,true,{general:`Something went wrong ${error.message}`},null)
        
    }
}


export const updatesingleproductController = async (req,res) => {
    let uploadedPublicIds= []
    let bannerImageLocalPath
    let detailImagesLocalPaths
    try {
        const {id} = req.params
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                    return sendResponse(res, 400, true, { general: "Invalid Product Id" }, null);
                }
        const files = req.files
        const {
            name,
            description,
            original_price,
            selling_price,
            stock,
            category_id
        } = req.body    
        
        
        const findProduct = await ProductModal.findById(id)
            
        if (!findProduct) {
              return sendResponse(res, 404, true, { general: "No product found of that Id" }, null);
        }

        // const lowerName = name.toLowerCase().trim()
        //         // console.log(name.toLowerCase());
                
        // const existingProduct = await ProductModal.findOne({
        //     _id:{$ne:id},
        //     name: lowerName
        // })
        // if (existingProduct) {
        //     return sendResponse(res,400,true,{general:"Product with this name already exists"},null)
        // }

        // get the local paths

        bannerImageLocalPath = files.banner_image[0].path
        detailImagesLocalPaths = files.detail_images.map(file => file.path)
        
        // upload the banner image to cloudinary and get the public id and push in array
        const bannerUpload = await cloudinary.uploader.upload(
            bannerImageLocalPath,{folder:"mart"}
        )
        const bannerUploadPublicId = bannerUpload.public_id
        uploadedPublicIds.push(
            bannerUploadPublicId
        )
        
        // upload the detail images to cloudinary and get the public id and push in array
        const detailImagesUpload = await Promise.all(detailImagesLocalPaths.map(
            imageUrl => cloudinary.uploader.upload(imageUrl,{folder:"mart"})
        ))
        // // Unki IDs save karlein taake agar error aaye toh delete kar saken
        const detailImagesUploadPublicId = detailImagesUpload.map(u => u.public_id)
        uploadedPublicIds.push(
            ...detailImagesUploadPublicId
        )
        const updateProduct = await ProductModal.findByIdAndUpdate(
            id,
            {
                name,
            description,
            original_price,
            selling_price,
            stock,
            category_id,
            banner_image: bannerUpload.secure_url,
            detail_images:detailImagesUpload.map(u => u.secure_url),
            },
            {
                new:true,runValidators:true
            }
        )
        if (!updateProduct) {
                   throw new Error("Database update failed");
        }

        // find product and delete old imageurls from cloudinary
        // --xxx--
       
        if (findProduct.banner_image && findProduct.detail_images.length > 0) {
            const deletePromises  = findProduct.detail_images.map(imageUrl => {
                const publicId = extractPublicId(imageUrl)
                return cloudinary.uploader.destroy(publicId)
                
            })
            await Promise.all([deletePromises,
                cloudinary.uploader.destroy(extractPublicId(findProduct.banner_image))] )
            
            
        }

        // delete the banner and details image from temp path save in local system
        if (fs.existsSync(bannerImageLocalPath)) fs.unlinkSync(bannerImageLocalPath)
        detailImagesLocalPaths.map(path => {
            if (fs.existsSync(path)) fs.unlinkSync(path)
            
        })
        console.log(uploadedPublicIds);
        
        return sendResponse(res, 200, false, null, {message: "Products added successfully" })
    } catch (error) {
        // agr error ajata ha save product krny ma db ka to phr banner or
        //  details image ki public id jo array ma save krwau thi hm dono ki public ids ko
        //  destroy krdain gy cloudinary sy 
        if(uploadedPublicIds.length > 0) {
            await Promise.all(
                uploadedPublicIds.map(id => cloudinary.uploader.destroy(id))
            )
        }
        // delete the banner and details image from temp path save in local system
        if (bannerImageLocalPath !== 0) {
            if (fs.existsSync(bannerImageLocalPath)) fs.unlinkSync(bannerImageLocalPath);
            
        }
        if (detailImagesLocalPaths.length > 0) {
            detailImagesLocalPaths.forEach(path => {
                if (fs.existsSync(path)) fs.unlinkSync(path);
            });
        }
        return sendResponse(res,500,true,{ general: `Something went wrong ${error.message}` },null)
                
    }
}