const mongoose=require('mongoose');
const ObjectId=mongoose.Types.ObjectId;


const addressSchema=mongoose.Schema({

    first_name:String,
    last_name:String,
    mobile:Number,
    email_id:String,
    address:String,
    city:String,
    state:String,
    country:String,
    pincode:Number,
    userId:ObjectId

},{
    timestamps:true
})


module.exports=mongoose.model('address',addressSchema)