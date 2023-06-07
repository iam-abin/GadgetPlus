const productSchema = require('../models/productModel');
const ObjectId = require('mongoose').Types.ObjectId
const fs = require('fs')
const slugify=require('slugify');



module.exports = {
    addProductToDb: (data, files) => {
        return new Promise(async (resolve, reject) => {
            let imagesArray = (Object.values(files)).flat(1);
            const slug=slugify(data.product_name)
            console.log("imagesArray", imagesArray, "imagesArray");
            // console.log(files);
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
                console.log(error);
            })
        })
    },

    // getAllProducts:()=>{
    //     return new Promise(async (resolve,reject)=>{
    //         await productSchema.
    //     })
    // },

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

    getAllProductsByCategory: (categoryId) => {
        return new Promise(async (resolve, reject) => {
            await productSchema.aggregate([
                {
                    $match: {
                        product_category: new ObjectId(categoryId)
                    }
                }
            ]).then((result) => {
                resolve(result)
            })
        })
    },

    filterProduct:(filterData)=>{
        return new Promise(async (resolve,reject)=>{
            console.log("categoryArray",filterData);
            let filteredProducts = await productSchema.find({
                product_category:{$in:filterData.selectedCategories},
                product_price:{$gte: Number(filterData.min),$lte: Number(filterData.max)}
            }).lean()
            console.log("filtered Products",filteredProducts);

            resolve(filteredProducts)

        })
    },

    getRecentProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await productSchema.find({}).sort({createdAt:-1}).limit(8).lean()
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
        console.log("isoutOfStok", slug);
        return new Promise(async (resolve, reject) => {
            await productSchema.findOne({ slug:slug }).lean()
                .then((result) => {
                    console.log("getAProduct",result);
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
                    console.log("getAProductById",result);
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },
    

    postEditAProduct: (data, productSlug, file) => {
        return new Promise(async (resolve, reject) => {
            // console.log("inside editAproduct promise", data);
            if (file) {
                new_image = file.filename;
                try {
                    console.log("-----------------------");
                    console.log(data.old_image);
                    console.log("-----------------------");

                    fs.unlink("/product-images/" + data.old_image, (err) => {
                        if (err) console.log(err);
                    })
                } catch (error) {
                    console.log(error);
                }
            } else {
                new_image = data.image;
            }

            const slug=slugify(data.product_name)
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
                    console.log("hello");
                    console.log(result);
                    resolve(result)
                })
                .catch((error) => {
                    console.log(error);
                })
        })
    },

    softDeleteProduct: (productSlug) => {
        return new Promise(async (resolve, reject) => {
            // console.log(productId);
            let product = await productSchema.findOne({slug:productSlug});
            product.product_status = !product.product_status;
            product.save();
            resolve(product);
        })
    },
 
    //to decrease stock when place order
    decreaseStock: (cartItems) => {
        return new Promise(async (resolve, reject) => {
            console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");
            // console.log("decreaseStock0",cartItems);
            for (let i = 0; i < cartItems.length; i++) {
                let product = await productSchema.findById({ _id: cartItems[i].item });
                // console.log("decreaseStock1",product);
                const isProductAvailableInStock = (product.product_quantity - cartItems[i].quantity) > 0 ? true : false;
                if (isProductAvailableInStock) {
                    product.product_quantity = product.product_quantity - cartItems[i].quantity;
                }
                // else{

                // }
                await product.save();
                // console.log("decreaseStock2",product);
            }
            console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");
            resolve(true)
        })
    },

    increaseStock: (orderDetails) => {
        return new Promise(async (resolve, reject) => {
            console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");

            console.log(orderDetails);

            console.log("{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{");
            console.log("increaseStock0",orderDetails);
            for (let i = 0; i < orderDetails.orderedItems.length; i++) {
                let product = await productSchema.findById({ _id: orderDetails.orderedItems[i].product });
                console.log("increaseStock1",product);
                // const isProductAvailableInStock = (product.product_quantity - cartItems[i].quantity) > 0 ? true : false;
                // if (isProductAvailableInStock) {
                product.product_quantity = product.product_quantity + orderDetails.orderedItems[i].quantity;
                // }
                // else{

                // }
                await product.save();
                console.log("increaseStock2",product);  
            }
            resolve(true)
        })
    },

    isOutOfStock: function (productSlug, newQuantity=false) {  // newQuantity for cart product quantity increase
        return new Promise(async (resolve, reject) => {
            let product = await this.getAProduct(productSlug);
            console.log("hio",product);
            let stock = product.product_quantity;

            // console.log("newQuantity",newQuantity);
            // console.log("let stock ",stock);
            
            if(newQuantity){  //in case cart product quantity increase or decrease
                stock = stock - newQuantity;
            }
            
            // console.log("let stockAfterIncOrDec ",stockAfterIncOrDec);
            console.log("hi");
            if (stock > 0) {
                resolve(false)
            } else {
                resolve(true)
            }

        })
    },

    // getMaximumPrice:()=>{
    //     return new Promise(async (resolve,reject)=>{
    //         let maxAmount = await productSchema.aggregate([
    //            { 
    //             $group:{
    //                 _id:null,
    //                 maxAmount:{$max:'$product_price'}

    //             }
    //            }
    //         ])

    //         console.log(maxAmount);
    //         resolve(maxAmount)
    //     })
    // },

    // getMinimumPrice:()=>{
    //     return new Promise(async (resolve,reject)=>{
    //         let minAmount = await productSchema.aggregate([
    //            { 
    //             $group:{
    //                 _id:null,
    //                 minAmount:{$min:'$product_price'}

    //             }
    //            }
    //         ])

    //         console.log(minAmount);
    //         resolve(minAmount)
    //     })
    // }

}