const productSchema = require('../models/productModel');
const ObjectId=require('mongoose').Types.ObjectId
const fs = require('fs')


module.exports = {
    addProductToDb: (data, file) => {
        return new Promise(async (resolve, reject) => {
            console.log(file);
            await productSchema.create({
                product_name: data.product_name,
                product_description: data.product_description,
                product_category: data.product_category,
                product_price: data.price,
                product_quantity: data.quantity,
                product_discount: data.discount,
                image: file.filename,
            }).then((result) => {
                resolve(result);
            }).catch((error) => {
                console.log(error);
            })
        })
    },

    getAllProductsWithLookup: () => {
        return new Promise(async (resolve, reject) => {
            const a = await productSchema.aggregate([{
                $lookup: {
                    from: "categories",
                    localField: "product_category",
                    foreignField: "_id",
                    as: "category"
                }
            }])
                .then((result) => {
                    // console.log("=============================");
                    // console.log(a[0].category[0].name);
                    // console.log("=============================");
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },

    getAllProductsByCategory:(categoryId)=>{
        return new Promise(async(resolve,reject)=>{
            await productSchema.aggregate([
                {
                    $match:{
                       product_category:new ObjectId(categoryId) 
                    }
                }
            ]).then((result)=>{
                resolve(result)
            })
        })
    },

    editAProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
            await productSchema.findById({ _id: productId })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },

    postEditAProduct: (data, productId, file) => {
        return new Promise(async (resolve, reject) => {
            console.log("inside editAproduct promise", data);
            if (file) {
                new_image = file.filename;
                try {
                    fs.unlink('/product-images/' + data.old_image)
                } catch (error) {
                    console.log(error);
                }
            } else {
                new_image = data.image;
            }

            await productSchema.findByIdAndUpdate({ _id: productId }, {
                $set: {
                    product_name: data.product_name,
                    product_description: data.product_description,
                    product_category: data.product_category,
                    product_price: data.price,
                    product_quantity: data.quantity,
                    product_discount: data.discount,
                    image: new_image
                }
            })
                .then((result) => {
                    console.log("hello");
                    console.log(result);
                    resolve(result)
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },

    softDeleteProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
            console.log(productId);
            let product = await productSchema.findById(productId);
            product.product_status = !product.product_status;
            product.save();
            resolve(product);
        })
    }

}