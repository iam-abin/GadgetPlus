const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const productHelper = require("./productHelper");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
    addToUserCart: async (userId, productId) => {
        try {
            const product = await productModel.findById(productId);
            if (!product.product_status) {
                throw new Error("Product Not Found");
            }

            const cart = await cartModel.updateOne(
                { user: userId },
                {
                    $push: {
                        products: { productItemId: productId, quantity: 1 },
                    },
                },
                { upsert: true }
            );

            return cart;
        } catch (error) {
            throw error;
        }
    },

    getAllCartItems: async function (userId) {
        try {
            let userCartItems = await cartModel.aggregate([
                {
                    $match: { user: new ObjectId(userId) },
                },
                {
                    $unwind: "$products",
                },
                {
                    $project: {
                        item: "$products.productItemId",
                        quantity: "$products.quantity",
                    },
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "item",
                        foreignField: "_id",
                        as: "product",
                    },
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        slug: 1,
                        coupon: 1,
                        product: {
                            $arrayElemAt: ["$product", 0],
                        },
                    },
                },
            ]);

            for (let i = 0; i < userCartItems.length; i++) {
                let outOfStock = await productHelper.isOutOfStock(
                    userCartItems[i].product.slug
                );
                userCartItems[i].product.isOutOfStock = outOfStock;
            }
            return userCartItems;
        } catch (error) {
            throw error;
        }
    },

    // function for - and + in card
    incDecProductQuantity: async (userId, productId, quantity) => {
        try {
            const cart = await cartModel.findOne({ user: userId });
            let cartProduct;
            cart.products.forEach((product) => {
                if (product.productItemId.toString() == productId) {
                    cartProduct = product;
                    return;
                }
            });

            let newQuantity = cartProduct.quantity + parseInt(quantity);

            if (newQuantity < 1 || newQuantity > 10) {
                newQuantity = 1;
            }

            let product = await productHelper.getAProductById(productId);
            let productSlug = product.slug;
            const isOutOfStock = await productHelper.isOutOfStock(
                productSlug,
                newQuantity
            );

            cartProduct.quantity = newQuantity;
            await cart.save();

            return { newQuantity, isOutOfStock };
        } catch (error) {
            throw error;
        }
    },

    removeAnItemFromCart: async (cartId, productId) => {
        try {
            const result = cartModel.updateOne(
                { _id: cartId },
                {
                    $pull: { products: { productItemId: productId } },
                },
                {
                    new: true,
                }
            ).lean();
			
            return result;
        } catch (error) {
            throw error;
        }
    },

    getCartCount: async (userId) => {
        try {
            let count = 0;
            let cart = await cartModel.findOne({ user: userId });
            if (cart) {
                count = cart.products.length;
            } else {
                count = 0;
            }
            return count;
        } catch (error) {
            throw error;
        }
    },

    isAProductInCart: async (userId, productId) => {
        try {
            const isInCart = await cartModel.findOne({
                user: userId,
                "products.productItemId": productId,
            });
            if (isInCart) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    },

    totalSubtotal: async function (userId) {
        try {
            let cart = await cartModel.findOne({ user: userId });
            let cartItems = await this.getAllCartItems(userId);

            let total = 0;
            if (cart) {
                if (cartItems.length) {
                    for (let i = 0; i < cartItems.length; i++) {
                        total =
                            total +
                            cartItems[i].quantity *
                                cartItems[i].product.product_price;
                    }
                }
                cart.totalAmount = total;
                await cart.save();
                return total;
            } else {
                return total;
            }
        } catch (error) {
            throw error;
        }
    },

    totalAmount: async (userId) => {
        try {
            const cart = await cartModel.findOne({ user: userId });
            return cart.totalAmount;
        } catch (error) {
            throw error;
        }
    },

    clearCart: async (userId) => {
        try {
            const result = await cartModel.findOneAndUpdate(
                { user: userId },
                { $set: { products: [] } },
                { new: true }
            );

            return result;
        } catch (error) {
            throw error;
        }
    },
};
