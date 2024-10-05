const wishListModel = require("../models/wishlistModel");
const productModel = require("../models/productModel");

const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
	addItemToWishList: async (productId, userId) => {
		try {
			const product = await productModel.findById(productId);
			if (!product.product_status) throw new Error("Product Not Found");

			const wishList = await wishListModel.updateOne(
				{
					user: userId,
				},
				{
					$push: {
						products: { productItemId: productId },
					},
				},
				{
					upsert: true,
				}
			);

			return wishList;
		} catch (error) {
			throw error;
		}
	},

	removeAnItemFromWishList: async (userId, productId) => {
		try {
			const result = await wishListModel.updateOne(
				{
					user: userId,
				},
				{
					$pull: { products: { productItemId: productId } },
				}
			);
			return result;
		} catch (error) {
			throw error;
		}
	},

	getAllWishListItems: async (userId) => {
		try {
			let wishListItems = await wishListModel.aggregate([
				{
					$match: { user: new ObjectId(userId) },
				},
				{
					$unwind: "$products",
				},
				{
					$project: {
						item: "$products.productItemId",
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
						product: {
							$arrayElemAt: ["$product", 0],
						},
					},
				},
			]);

			return wishListItems;
		} catch (error) {
			throw error;
		}
	},
    
	isProductInWishList: async (userId, productId) => {
		try {
			const wishList = await wishListModel.findOne({
				user: userId,
				"products.productItemId": productId,
			});
			if (wishList) {
				return true;
			} else {
				return false;
			}
		} catch (error) {
			throw error;
		}
	},

	getWishListCount: async (userId) => {
		try {
			let wishlist = await wishListModel.findOne({ user: userId });
			let wishlistCount = wishlist?.products.length;
			return wishlistCount;
		} catch (error) {
			throw error;
		}
	},
};
