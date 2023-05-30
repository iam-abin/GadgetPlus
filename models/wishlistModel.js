const mongoose=require('mongoose')

const wishListSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },

    products:[
        {
            productItemId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products',
                required:true
            },
        }
    ]
},
{
    timestamps:true
})


module.exports= new mongoose.model("wishList",wishListSchema);