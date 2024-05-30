const productModel = require("../models/productModel");
const ObjectId = require("mongoose").Types.ObjectId;
const fs = require("fs");
const slugify = require("slugify");

module.exports = {
	addProductToDb: async (data, files) => {
		try {
			let imagesArray = Object.values(files).flat(1);
			const slug = slugify(data.product_name);

			const product = await productModel.create({
				product_name: data.product_name,
				product_description: data.product_description,
				product_category: data.product_category,
				product_price: data.price,
				product_quantity: data.quantity,
				product_discount: data.discount,
				image: imagesArray,
				slug: slug,
			});
			return product;
		} catch (error) {
			throw error;
		}
	},

	getAllProductsWithLookup: async () => {
		try {
			const products = await productModel.aggregate([
				{
					$lookup: {
						from: "categories",
						localField: "product_category",
						foreignField: "_id",
						as: "category",
					},
				},
			]);
			return products;
		} catch (error) {
			throw error;
		}
	},

	getAllProductsByCategory: async (categoryId) => {
		try {
			const allProducts = await productModel.aggregate([
				{
					$match: {
						product_category: new ObjectId(categoryId),
					},
				},
			]);
			return allProducts;
		} catch (error) {
			throw error;
		}
	},

	filterProduct: async (filterData) => {
		try {
			let filteredProducts = await productModel
				.find({
					product_category: { $in: filterData.selectedCategories },
					product_price: {
						$gte: Number(filterData.min),
						$lte: Number(filterData.max),
					},
				})
				.lean();

			return filteredProducts;
		} catch (error) {
			throw error;
		}
	},

	getRecentProducts: async () => {
		try {
			let products = await productModel
				.find({})
				.sort({ createdAt: -1 })
				.limit(8)
				.lean();
			return products;
		} catch (error) {
			throw error;
		}
	},

	getFeaturedProducts: async () => {
		try {
			let featuredProducts = await productModel.aggregate([
				{
					$sample: { size: 4 }, //to get 4 random products
				},
				{
					$lookup: {
						from: "categories",
						localField: "product_category",
						foreignField: "_id",
						as: "category",
					},
				},
			]);
			return featuredProducts;
		} catch (error) {
			throw error;
		}
	},

	getAProduct: async (slug) => {
		console.log("Inside get a Product");
		try {
			const product = await productModel.findOne({ slug: slug }).lean();
			return product;
		} catch (error) {
			throw error;
		}
	},

	getAProductById: async (productId) => {
		try {
			const product = await productModel.findById(productId).lean();
			return product;
		} catch (error) {
			throw error;
		}
	},

	postEditAProduct: async (data, productSlug, file) => {
		try {
			if (file) {
				new_image = file.filename;
				fs.unlink("/product-images/" + data.old_image, (err) => {
					if (err) console.log(err);
				});
			} else {
				new_image = data.image;
			}

			const slug = slugify(data.product_name);
			const result = await productModel.findOneAndUpdate(
				{ slug: productSlug },
				{
					$set: {
						product_name: data.product_name,
						product_description: data.product_description,
						product_category: data.product_category,
						product_price: data.price,
						product_quantity: data.quantity,
						product_discount: data.discount,
						image: new_image,
						slug: slug,
					},
				}
			);
			return result;
		} catch (error) {
			throw error;
		}
	},

	softDeleteProduct: async (productSlug) => {
		try {
			let product = await productModel.findOne({ slug: productSlug });
			product.product_status = !product.product_status;
			product.save();
			return product;
		} catch (error) {
			throw error;
		}
	},

	//to decrease stock when place order
	decreaseStock: async (cartItems) => {
		try {
			for (let i = 0; i < cartItems.length; i++) {
				let product = await productModel.findById({
					_id: cartItems[i].item,
				});

				const isProductAvailableInStock =
					product.product_quantity - cartItems[i].quantity > 0
						? true
						: false;
				if (isProductAvailableInStock) {
					product.product_quantity =
						product.product_quantity - cartItems[i].quantity;
				} else {
				}

				await product.save();
			}
			return true;
		} catch (error) {
			throw error;
		}
	},

	increaseStock: async (orderDetails) => {
		try {
			for (let i = 0; i < orderDetails.orderedItems.length; i++) {
				let product = await productModel.findById(
					orderDetails.orderedItems[i].product
				);

				product.product_quantity =
					product.product_quantity +
					orderDetails.orderedItems[i].quantity;
				await product.save();
			}
			return true;
		} catch (error) {
			throw error;
		}
	},

	isOutOfStock: async function(productSlug, newQuantity = false) {
		// newQuantity for cart product quantity increase
		console.log(this);
		try {
			let product = await this.getAProduct(productSlug);
			let stock = product.product_quantity;

			if (newQuantity) {
				//in case cart product quantity increase or decrease
				stock = stock - newQuantity;
			}

			if (stock > 0) {
				return false;
			} else {
				return true;
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	},
};
