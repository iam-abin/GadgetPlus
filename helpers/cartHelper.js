const cartSchema = require('../models/cartModel');
const productSchema = require('../models/productModel');
const productHelper = require('../helpers/productHelper')
const ObjectId = require('mongoose').Types.ObjectId;


module.exports = {

    addToUserCart: (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            const product = await productSchema.findOne({ _id: productId });
            if (!product.product_status) {
                reject(Error("Product Not Found"));
            }

            const cart = await cartSchema.updateOne(
                { user: userId },
                { $push: { products: { productItemId: productId, quantity: 1 } } },
                { upsert: true }
            );

            resolve(cart);
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
                        quantity: "$products.quantity",

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
                        slug: 1,
                        coupon: 1,
                        product: {
                            $arrayElemAt: ['$product', 0]
                        }
                    }
                }
            ]);

            for (let i = 0; i < userCartItems.length; i++) {
                let outOfStock = await productHelper.isOutOfStock(userCartItems[i].product.slug)
                userCartItems[i].product.isOutOfStock = outOfStock;
            }
            resolve(userCartItems);
        });
    },


    incDecProductQuantity: (userId, productId, quantity) => {
        return new Promise(async (resolve, reject) => {

            const cart = await cartSchema.findOne({ user: userId });
            let cartProduct;
            cart.products.forEach((product) => {
                console.log(product.productItemId.toString() == productId);
                if (product.productItemId.toString() == productId) {
                    cartProduct = product;
                    return
                }
            });

            let newQuantity = cartProduct.quantity + parseInt(quantity);

            if (newQuantity < 1 || newQuantity > 10) {
                newQuantity = 1;
            }

            let aProduct = await productHelper.getAProductById(productId);
            let productSlug = aProduct.slug;
            const isOutOfStock = await productHelper.isOutOfStock(productSlug, newQuantity)

            cartProduct.quantity = newQuantity;
            await cart.save();

            resolve({ newQuantity, isOutOfStock });
        })
    },


    removeAnItemFromCart: (cartId, productId) => {
        return new Promise(async (resolve, reject) => {
            cartSchema.updateOne(
                { _id: cartId },
                {
                    $pull: { products: { productItemId: productId } }
                }
            ).then((result) => {
                resolve(result);
            })
        })
    },


    getCartCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let count = 0;
            let cart = await cartSchema.findOne({ user: userId });
            if (cart) {
                count = cart.products.length;
            } else {
                count = 0;
            }
            resolve(count);
        })
    },


    isAProductInCart: async (userId, productId) => {
        try {
            const cart = await cartSchema.findOne({ user: userId, 'products.productItemId': productId })
            if (cart) {
                return true;
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
        }
    },


    totalSubtotal: (userId, cartItems) => {
        return new Promise(async (resolve, reject) => {
            let cart = await cartSchema.findOne({ user: userId });

            let total = 0;
            if (cart) {
                if (cartItems.length) {
                    for (let i = 0; i < cartItems.length; i++) {
                        total = total + (cartItems[i].quantity * cartItems[i].product.product_price);
                    }
                }
                cart.totalAmount = total;
                await cart.save();
                resolve(total);
            } else {
                resolve(total);
            }
        })
    },


    totalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
            const cart = await cartSchema.findOne({ user: userId });
            resolve(cart.totalAmount);
        })
    },


    clearCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            await cartSchema.findOneAndUpdate(
                { user: userId },
                { $set: { products: [] } },
                { new: true })

                .then((result) => {
                    resolve(result)
                })
        })
    }

}