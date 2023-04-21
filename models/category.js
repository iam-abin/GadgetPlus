const mongoose=require('mongoose');

const categoryModel=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
},
{
    timestamps:true,
})

module.exports=new mongoose.model("Category",categoryModel)