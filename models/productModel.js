const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        unique:true,
    },
    product_description:{
        type:String
    },
    
    product_category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"categories",
        required:true,
        // unique:true,
    },
    product_price:{
        type:String,
        required:true
    },
    product_quantity:{
        type:String,
        required:true
    },
    product_discount:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    product_status:{
        type:Boolean,
        default:true
    },
},
{
    timestamps:true,
})


module.exports=mongoose.model('product',productSchema);