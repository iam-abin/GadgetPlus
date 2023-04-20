const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    product_name:{
        type:String,
        required:true
    },
    image:[{
        type:String,
        required:true
    }],
    product_category:{
        type:String,
        required:true
    },
    product_price:{
        type:Number,
        required:true
    },
    product_quantity:{
        type:Number,
        required:true
    },
    product_description:{
        type:String
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