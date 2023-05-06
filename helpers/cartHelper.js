const { cart } = require('../controllers/userController');
const cartSchema = require('../models/cartModel');
const productSchema = require('../models/productModel')
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    // addToUserCart: (userId, productId) => {

    //     let productObject = {
    //         productItemId: productId,
    //         quantity: 1
    //     }

    //     return new Promise(async (resolve, reject) => {
    //         let userCart = await cartSchema.findOne({ user: userId })

    //         console.log("user cart", userCart);

    //         if (userCart) {
    //             let productExist = userCart.products.findIndex(product => product.productItemId == productId);
    //             // console.log('//////////',productExist);
    //             // if (productExist != -1) {
    //             //     cartSchema.updateOne({ user: userId, "products.productItemId": productId }, { $inc: { "products.$.quantity": 1 } }, { upsert: true })
    //             //         .then((response) => {
    //             //             console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    //             //             console.log(response);
    //             //             console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    //             //             resolve(response)
    //             //         })
    //             // } else {
    //                 // cartSchema.updateOne({ user: userId }, { $push: { products: productObject } })
    //                 //     .then((response) => {

    //                 //         resolve(response)
    //                 //     })
    //             // }
    //         } else {
    //             let cart = new cartSchema({
    //                 user: userId,
    //                 products: productObject
    //             })

    //             await cart.save();
    //             resolve(cart);
    //         }
    //     })
    // },

    addToUserCart: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            const product = await productSchema.findOne({ _id: productId });
            if (!product.product_status) {
                reject(Error("Product Not Found"))
            }

            const cart = await cartSchema.updateOne(
                { user: userId },
                { $push: { products: { productItemId: productId, quantity: 1 } } },
                { upsert: true }
            );

            resolve(cart)
        })
    },



    getAllCartItems: (userId) => {
        return new Promise(async (resolve, reject) => {
            let userCartItems = await cartSchema.aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: "$products"
                },
                {
                    $project: {
                        item: "$products.productItemId",
                        quantity: "$products.quantity"
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        product: {
                            $arrayElemAt: ['$product', 0]
                        }
                    }
                }
            ]);


            console.log("--------------------------------------");
            console.log(userCartItems);
            console.log("--------------------------------------");

            resolve(userCartItems);

        });

    },

    removeAnItemFromCart: (cartId, productId) => {
        return new Promise(async (resolve, reject) => {
            cartSchema.updateOne({ _id: cartId },
                {
                    $pull: { products: { productItemId: productId } }
                }
            ).then((result) => {
                resolve(result)
            })
        })
    },


    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await cartSchema.findOne({ user: userId })
            if (cart) {
                count = cart.products.length;
            }

            resolve(count)
        })
    },

    isAProductInCart:async (userId,productId)=>{
        try {
            const cart=await cartSchema.findOne({user:userId})
            const isInCart= await cart.products.some((product)=>{
                product.productItemId == new ObjectId(productId)
            })

            return isInCart
            
        } catch (error) {
            console.log(error);
        }
    },

}