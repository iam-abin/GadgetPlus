const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    product_name:{
        type:String,
        required:true
    },
    product_description:{
        type:String
    },
    // image:[{
    //     type:String,
    //     required:true
    // }],
    // product_category:{
    //     type:String,
    //     required:true
    // },
    product_price:{
        type:String,
        required:true
    },
    product_quantity:{
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