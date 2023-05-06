const mongoose=require('mongoose')

const wishListSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },

    products:[
        {
            productItemId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products'
            }
        }
    ]
},
{
    timestamps:true
})


module.exports=mongoose.model("wishList",wishListSchema);