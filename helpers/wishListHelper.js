const wishListSchema = require('../models/wishlistModel')
const productSchema = require('../models/productModel');

const ObjectId = require('mongoose').Types.ObjectId;


module.exports = {

    addItemToWishList: (productId, userId) => {
        return new Promise(async (resolve, reject) => {

            const product = await productSchema.findOne({ _id: productId });
            if (!product.product_status) {
                reject(Error("Product Not Found"));
            }

            const wishList = await wishListSchema.updateOne(
                {
                    user: userId
                },
                {
                    $push: {
                        products: { productItemId: productId }
                    }
                },
                {
                    upsert: true
                }
            )

            resolve(wishList);

        })
    },


    removeAnItemFromWishList: async (userId, productId) => {
        return new Promise(async (resolve, reject) => {
            await wishListSchema.updateOne(
                {
                    user: userId
                },
                {
                    $pull: { products: { productItemId: productId } }
                }
            )
                .then((result) => {
                    resolve(result);
                })
        })
    },


    getAllWishListItems: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wishListItems = await wishListSchema.aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: "$products.productItemId",
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
                        product: {
                            $arrayElemAt: ['$product', 0]
                        }
                    }
                }
            ]);

            resolve(wishListItems)
        })
    },


    isProductInWishList:async (userId,productId)=>{
        try {
            const wishList=await wishListSchema.findOne({user:userId , 'products.productItemId':productId});
            if(wishList){
                return true;
            }else{
                return false;
            }
        } catch (error) {
            console.log(error);
        }
    },


    getWishListCount: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wishlist = await wishListSchema.findOne({ user: userId });
            let wishlistCount = wishlist?.products.length;
            resolve(wishlistCount);
        })
    },

}