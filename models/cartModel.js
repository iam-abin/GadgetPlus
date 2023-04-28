const mongoose=require('mongoose')

const cartModel=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products'
            }
        }
    ],
    coupon:{
        type:String,
        default:0
    },

    totalAmount:{
        type:Number,
        reqruire:true
    },
    
    status:Boolean,
},
{
    timestamps:true
}
)


module.exports=new mongoose.model('Cart',cartModel)