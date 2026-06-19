import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    description: { type: String, required: true },
    original_price:{
        type:Number,
        required:true,
    },
    selling_price:{
        type:Number,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    banner_image:{type:String,required: true},
    detail_images:[{type:String,required: true}],
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category',
        required:true
    }

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

export const ProductModal = mongoose.model('product',ProductSchema)