// this file is for define a schema

const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone:{
        type:String,
        required:true,
        trim: true,
        unique : true
    },
    password:{
        type:String,
        required:true,
        trim: true
    },
    isActive:{
        type:Boolean,
        required:true,
        default:true
    }
},
{
    timestamps:true,
    collection:'users'
}
)


module.exports=mongoose.model('user',userSchema)