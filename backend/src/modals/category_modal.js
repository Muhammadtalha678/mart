import mongoose from 'mongoose'
import cloudinary from '../lib/configs/cloudinary_config.js'
import {extractPublicId} from '../lib/helper/extract_public_id.js'

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,lowercase:true,
        trim:true
    },
    description: { type: String, required: true }
},{
    timestamps:true,
    toJSON:{ // this hide _id and show id and hide the __v 
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id
            delete ret.__v
            return ret
        }
    }
})

// Cascade delete one categ delete many product of that _id
CategorySchema.pre("findOneAndDelete",async function() {
    try {
        const categoryId = this.getQuery()._id
         if (!categoryId) return next(); // Agar ID nahi milti toh agle process par jao

        // 1. Delete karne se pehle saare matching products ka data nikalen
        const productsToDelete = await mongoose.model("product").find({ category_id: categoryId });
        
        const deletePromises = [];
        
        if (productsToDelete.length > 0) {
                // 2. Loop chala kar saari images ke promises array mein daalein
                productsToDelete.forEach(product => {
                    if (product.banner_image) {
                        deletePromises.push(cloudinary.uploader.destroy(extractPublicId(product.banner_image)));
                    }
                    if (product.detail_images && product.detail_images.length > 0) {
                        product.detail_images.forEach(imageUrl => {
                            deletePromises.push(cloudinary.uploader.destroy(extractPublicId(imageUrl)));
                        });
                    }
                });}
        
        const products = await mongoose.model("product").deleteMany({category_id:categoryId})
        // 3. Cloudinary se saari images ek sath urayein
        if (deletePromises.length > 0) {
            await Promise.all(deletePromises);
            // console.log(`Cloudinary assets deleted for ${productsToDelete.length} products.`);
        }
    } catch (error) {
        throw error
    }
})
export const CategoryModal = mongoose.model("category",CategorySchema)