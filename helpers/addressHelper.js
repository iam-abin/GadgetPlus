const addressSchema=require('../models/addressModel');

module.exports={
    addAddress:(addressData)=>{
        return new Promise(async (resolve,reject)=>{
            let address = await new addressSchema({
                first_name:addressData.fname,
                last_name:addressData.lname,
                mobile:addressData.mobile,
                email_id:addressData.email,
                address:addressData.address,
                city:addressData.city,
                state:addressData.state,
                country:addressData.country,
                pincode:addressData.pincode,
                userId:addressData.id
            })

            await address.save();
            resolve(address)
        })
    },

    findAddresses:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            await addressSchema.find({userId: userId})
            .then((result)=>{
                resolve(result)
            })
        })
    }
}