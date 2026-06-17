import mongoose from 'mongoose'

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
        await mongoose.model("product").deleteMany({categoryId})
    } catch (error) {
        throw error
    }
})
export const CategoryModal = mongoose.model("category",CategorySchema)