const productSchema = require('../models/productModel');
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')
const slugify=require('slugify');


module.exports = {

    addProductToDb: (data, files) => {
        return new Promise(async (resolve, reject) => {
            let imagesArray = (Object.values(files)).flat(1);
            const slug=slugify(data.product_name);

            await productSchema.create({
                product_name: data.product_name,
                product_description: data.product_description,
                product_category: data.product_category,
                product_price: data.price,
                product_quantity: data.quantity,
                product_discount: data.discount,
                image: imagesArray,
                slug:slug
            }).then((result) => {
                resolve(result);
            }).catch((error) => {
                reject(error);
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
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },


    getAllProductsByCategory: (categoryId) => {
        return new Promise(async (resolve, reject) => {
            await productSchema.aggregate([
                {
                    $match: {
                        product_category: new ObjectId(categoryId)
                    }
                }
            ]).then((result) => {
                resolve(result);
            })
        })
    },


    filterProduct:(filterData)=>{
        return new Promise(async (resolve,reject)=>{
            let filteredProducts = await productSchema.find({
                product_category:{$in:filterData.selectedCategories},
                product_price:{$gte: Number(filterData.min),$lte: Number(filterData.max)}
            }).lean();

            resolve(filteredProducts)
        })
    },


    getRecentProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await productSchema.find({}).sort({createdAt:-1}).limit(8).lean();
            resolve(products);
        })
    },


    getFeaturedProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let featuredProducts = await productSchema.aggregate([
                {
                    $sample:{size:4}, //to get 8 random products
                }
            ])
            resolve(featuredProducts);
        })
    },


    getAProduct: (slug) => {
        return new Promise(async (resolve, reject) => {
            await productSchema.findOne({ slug:slug }).lean()
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },


    getAProductById: (productId) => {
        return new Promise(async (resolve, reject) => {
            await productSchema.findOne({ _id:productId }).lean()
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },
    

    postEditAProduct: (data, productSlug, file) => {
        return new Promise(async (resolve, reject) => {
            if (file) {
                new_image = file.filename;
                try {
                    fs.unlink("/product-images/" + data.old_image, (err) => {
                        if (err) console.log(err);
                    })
                } catch (error) {
                    console.log(error);
                }
            } else {
                new_image = data.image;
            }

            const slug=slugify(data.product_name);
            await productSchema.findOneAndUpdate({ slug: productSlug }, {
                $set: {
                    product_name: data.product_name,
                    product_description: data.product_description,
                    product_category: data.product_category,
                    product_price: data.price,
                    product_quantity: data.quantity,
                    product_discount: data.discount,
                    image: new_image,
                    slug:slug
                }
            })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },


    softDeleteProduct: (productSlug) => {
        return new Promise(async (resolve, reject) => {
            let product = await productSchema.findOne({slug:productSlug});
            product.product_status = !product.product_status;
            product.save();
            resolve(product);
        })
    },
 
    //to decrease stock when place order
    decreaseStock: (cartItems) => {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < cartItems.length; i++) {
                let product = await productSchema.findById({ _id: cartItems[i].item });

                const isProductAvailableInStock = (product.product_quantity - cartItems[i].quantity) > 0 ? true : false;
                if (isProductAvailableInStock) {
                    product.product_quantity = product.product_quantity - cartItems[i].quantity;
                }

                await product.save();
            }
            resolve(true);
        })
    },


    increaseStock: (orderDetails) => {
        return new Promise(async (resolve, reject) => {

            for (let i = 0; i < orderDetails.orderedItems.length; i++) {
                let product = await productSchema.findById({ _id: orderDetails.orderedItems[i].product });
             
                product.product_quantity = product.product_quantity + orderDetails.orderedItems[i].quantity;
                await product.save();
            }
            resolve(true);
        })
    },


    isOutOfStock: function (productSlug, newQuantity=false) {  // newQuantity for cart product quantity increase
        return new Promise(async (resolve, reject) => {
            let product = await this.getAProduct(productSlug);
            let stock = product.product_quantity;

            if(newQuantity){  //in case cart product quantity increase or decrease
                stock = stock - newQuantity;
            }
            
            if (stock > 0) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    },

}