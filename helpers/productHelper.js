const productSchema=require('../models/productModel');


module.exports={
    addProductToDb:(data)=>{
        return new Promise(async (resolve,reject)=>{
            console.log(data);
            await productSchema.create({
                product_name:data.product_name,
                product_description:data.product_description,
                product_price:data.price,
                product_quantity:data.quantity,
            }).then((result)=>{
                resolve(result);
            }).catch((error)=>{
                console.log(error);
            })
        })
    },

    getAllProducts:()=>{
        return new Promise(async (resolve,reject)=>{
            await productSchema.find({})
            .then((result)=>{
                resolve(result);
            })
            .catch((error)=>{
                console.log(error);
            })
        })
    }
}