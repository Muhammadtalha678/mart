import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name:{type:String,required:[true,"Please add a name"],trim:true},
    email:{type:String,required:[true,"Please add a email"],unique:true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
    },
    password:{type:String,required:[true,"Please add a password"],minlength:8},
    role:{
        type:String,
        enum:["admin","user"],
        default: "user"
    }
},{timestamps:true})

const UserModal = mongoose.model("users",UserSchema)

export default UserModal