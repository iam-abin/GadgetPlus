const userSchema = require("../models/userModel");
const couponSchema = require("../models/couponModel");
const productSchema = require("../models/productModel");

const userHelper = require("../helpers/userHelper");
const productHelper = require("../helpers/productHelper");
const cartHelper = require("../helpers/cartHelper");
const addressHelper = require("../helpers/addressHelper");
const orderHelper = require("../helpers/orderHepler");
const couponHelper = require("../helpers/coupenHelper");
const wishListHelper = require("../helpers/wishListHelper");
const walletHelper = require("../helpers/walletHelper");

const { formatCurrency } = require("../utils/currency-format");
const { formatDate } = require("../utils/date-format");

const twilio = require("../api/twilio");
const razorpay = require("../api/razorpay");
const paypal = require("../api/paypal");

// var easyinvoice = require("easyinvoice");

let cartCount;
let wishListCount;

const landingPage = async (req, res, next) => {
	try {
		let latestProducts = await productHelper.getRecentProducts();
		let featuredProducts = await productHelper.getFeaturedProducts();

		for (let i = 0; i < latestProducts.length; i++) {
			latestProducts[i].product_price = formatCurrency(
				latestProducts[i].product_price
			);

			featuredProducts[i].product_price = formatCurrency(
				featuredProducts[i].product_price
			);
		}

		res.render("user/index", {
			loginStatus: req.session.user,
			latestProducts,
			featuredProducts,
		});
	} catch (error) {
		next(error);
	}
};

const userHome = async (req, res, next) => {
	try {
		let userId = req.session.user._id;
		cartCount = await cartHelper.getCartCount(userId);
		wishListCount = await wishListHelper.getWishListCount(userId);
		let latestProducts = await productHelper.getRecentProducts();
		let featuredProducts = await productHelper.getFeaturedProducts();

		for (let i = 0; i < latestProducts.length; i++) {
			const isInWishList = await wishListHelper.isProductInWishList(
				userId,
				latestProducts[i]._id
			);
			const isInCart = await cartHelper.isAProductInCart(
				userId,
				latestProducts[i]._id
			);

			latestProducts[i].isInWishList = isInWishList;
			latestProducts[i].isInCart = isInCart;

			latestProducts[i].product_price = formatCurrency(
				latestProducts[i].product_price
			);
		}

		for (let i = 0; i < featuredProducts.length; i++) {
			const isInWishList = await wishListHelper.isProductInWishList(
				userId,
				featuredProducts[i]._id
			);
			const isInCart = await cartHelper.isAProductInCart(
				userId,
				featuredProducts[i]._id
			);

			featuredProducts[i].isInWishList = isInWishList;
			featuredProducts[i].isInCart = isInCart;

			featuredProducts[i].product_price = formatCurrency(
				featuredProducts[i].product_price
			);
		}

		res.status(200).render("user/index", {
			loginStatus: req.session.user,
			cartCount,
			wishListCount,
			latestProducts,
			featuredProducts,
		});
	} catch (error) {
		next(error);
	}
};

const error = (req, res) => {
	res.render("/error");
};

const userSignup = async (req, res) => {
	res.render("user/signup", { headerFooter: true });
};

const userSignupPost = async (req, res, next) => {
	try {
		const response = userHelper.doSignup(req.body);
		if (!response.userExist) {
			res.redirect("/user-login");
		} else {
			res.redirect("/");
		}
	} catch (error) {
		next(error);
	}
};

const userLogin = async (req, res) => {
	res.render("user/login", {
		headerFooter: true,
		loggedInError: req.session.loggedInError,
	});
};

const userLoginPost = async (req, res, next) => {
	try {
		const response = await userHelper.doLogin(req.body);
		if (response.loggedIn) {
			req.session.user = response.user;
			res.status(202).json({
				error: false,
				message: response.logginMessage,
			});
		} else {
			res.status(401).json({
				error: false,
				message: response.logginMessage,
			});
		}
	} catch (error) {
		next(error);
	}
};

const forgotPassword = (req, res) => {
	res.render("user/otp-mobile-forgotpswd");
};

const otpSendingForgot = async (req, res, next) => {
	try {
		const find = req.body;

		req.session.mobile = find.phone;
		const userWithNumber = await userSchema.findOne({ phone: find.phone });
		if (userWithNumber) {
			await twilio.sentOtp(find.phone);
			res.render("user/otp-fill-forgotpswd");
		} else {
			res.redirect("/user-signup");
		}
		// .catch((error) => {
		// 	res.redirect("/user-signup");
		// });
	} catch (error) {
		next(error);
	}
};

const otpVerifyingForgot = async (req, res, next) => {
	const phone = req.session.mobile;
	const otp = req.body.otp;

	try {
		const status = await twilio.verifyOtp(phone, otp);
		if (status) {
			res.render("user/resetPassword");
		} else {
			res.redirect("/user-signup");
		}
	} catch (error) {
		next(error);
	}
};

const resetPassword = async (req, res, next) => {
	try {
		const phone = req.session.mobile;
		let newPassword = req.body.confirmPassword;
		await userHelper.changePassword(newPassword, phone);
		res.redirect("/user-login");
	} catch (error) {
		next(error);
	}
};

// otp login page
const otpUser = (req, res) => {
	res.render("user/otp-form", { loginStatus: req.session.user });
};

// otp sending in login process
const otpSending = async (req, res, next) => {
	const find = req.body;
	req.session.mobile = req.body.phone;
	try {
		const userData = await userSchema.findOne({ phone: find.phone });
		if (userData) {
			req.session.tempUser = userData;
			await twilio.sentOtp(find.phone);
			res.render("user/otp-fill");
		} else {
			res.redirect("/user-signup");
		}

		// .catch((error) => {
		// 	res.redirect("/user-signup");
		// });
	} catch (error) {
		next(error);
	}
};

// otp verification process
const otpVerifying = async (req, res, next) => {
	const phone = req.session.mobile;
	const otp = req.body.otp;

	try {
		const status = await twilio.verifyOtp(phone, otp);
		if (status) {
			req.session.user = req.session.tempUser;
			res.redirect("/");
		} else {
			res.redirect("/user-signup");
		}
	} catch (error) {
		next(error);
	}
};

const getWallet = async (req, res, next) => {
	try {
		let userId = req.session.user._id;
		let walletBalance = await walletHelper.walletBalance(userId);
		walletDetails = formatCurrency(walletBalance);
		res.json({ walletDetails });
	} catch (error) {
		next(error);
	}
};

const userLogout = async (req, res, next) => {
	try {
		req.session.user = null;
		res.redirect("/");
	} catch (error) {
		next(error);
	}
};

const profile = async (req, res, next) => {
	try {
		let userId = req.session.user._id;
		let addresses = await addressHelper.findAddresses(userId);
		res.render("user/profile", {
			loginStatus: req.session.user,
			addresses,
			cartCount,
			wishListCount,
		});
	} catch (error) {
		next(error);
	}
};

const viewProducts = async (req, res, next) => {
	try {
		let products;
		// let minAmount= await productHelper.getMinimumPrice();
		// let maxAmount= await productHelper.getMaximumPrice();
		// const page = req.params.page;
		// const perPage = 2;
		if (req.session.user) {
			let userId = req.session.user._id;
			cartCount = await cartHelper.getCartCount(userId);
			wishListCount = await wishListHelper.getWishListCount(userId);
		}

		if (!req.query.filterData) {
			products = await productHelper.getAllProductsWithLookup();
			for (let i = 0; i < products.length; i++) {
				if (req.session.user) {
					let userId = req.session.user._id;
					const isInCart = await cartHelper.isAProductInCart(
						userId,
						products[i]._id
					);
					const isInWishList =
						await wishListHelper.isProductInWishList(
							userId,
							products[i]._id
						);

					products[i].isInCart = isInCart;
					products[i].isInWishList = isInWishList;
				}
				products[i].product_price = Number(
					products[i].product_price
				).toLocaleString("en-in", {
					style: "currency",
					currency: "INR",
				});
			}

			res.render("user/view-products", {
				product: products,
				loginStatus: req.session.user,
				cartCount,
				wishListCount,
			});
		} else {
			let filterData = JSON.parse(req.query.filterData);
			products = await productHelper.filterProduct(filterData);
			for (let i = 0; i < products.length; i++) {
				if (req.session.user) {
					let userId = req.session.user._id;
					const isInCart = await cartHelper.isAProductInCart(
						userId,
						products[i]._id
					);
					const isInWishList =
						await wishListHelper.isProductInWishList(
							userId,
							products[i]._id
						);

					products[i].isInCart = isInCart;
					products[i].isInWishList = isInWishList;
				}
				products[i].product_price = Number(
					products[i].product_price
				).toLocaleString("en-in", {
					style: "currency",
					currency: "INR",
				});
			}
			res.json({
				product: products,
				loginStatus: req.session.user,
				cartCount,
				wishListCount,
			});
		}
	} catch (error) {
		next(error);
	}
};

const viewAProduct = async (req, res, next) => {
	try {
		let productSlug = req.params.slug;
		let product = await productHelper.getAProduct(productSlug);
		if (req.session.user) {
			const isInCart = await cartHelper.isAProductInCart(
				req.session.user._id,
				product._id
			);
			product.isInCart = isInCart;
		}
		product.product_price = formatCurrency(product.product_price);
		res.render("user/quick-view", {
			product,
			cartCount,
			loginStatus: req.session.user,
			wishListCount,
		});
	} catch (error) {
		next(error);
	}
};

const wishlist = async (req, res, next) => {
	try {
		let userId = req.session.user._id;
		let wishList = await wishListHelper.getAllWishListItems(userId);
		res.render("user/wishlist", {
			loginStatus: req.session.user,
			wishList,
			cartCount,
			wishListCount,
		});
	} catch (error) {
		next(error);
	}
};

const addToWishList = async (req, res, next) => {
	try {
		let productId = req.body.productId;
		let user = req.session.user._id;
		wishListHelper.addItemToWishList(productId, user);
		res.json({ message: `item added to wishList ${productId}` });
	} catch (error) {
		next(error);
	}
};

const removeFromWishList = async (req, res, next) => {
	let userId = req.session.user._id;
	let productId = req.body.productId;
	try {
		await wishListHelper.removeAnItemFromWishList(userId, productId);
		wishListCount = await wishListHelper.getWishListCount(userId);
		res.status(200).json({
			message: "product removed from wishList",
			wishListCount,
		});
	} catch (error) {
		next(error);
	}
};

const cart = async (req, res, next) => {
	try {
		let user = req.session.user;
		let cartItems = await cartHelper.getAllCartItems(user._id);
		cartCount = await cartHelper.getCartCount(user._id);
		wishListCount = await wishListHelper.getWishListCount(user._id);
		let totalandSubTotal = await cartHelper.totalSubtotal(
			user._id,
			cartItems
		);

		totalandSubTotal = formatCurrency(totalandSubTotal);
		res.render("user/cart", {
			loginStatus: req.session.user,
			cartItems,
			cartCount,
			totalAmount: totalandSubTotal,
			wishListCount,
		});
	} catch (error) {
		next(error);
	}
};

const addToCart = async (req, res, next) => {
	try {
		let productId = req.params.id;
		let user = req.session.user;
		console.log("/////////////////////");
		console.log(user);
		console.log("/////////////////////");
		let response = await cartHelper.addToUserCart(user._id, productId);
		if (response) {
			cartCount = await cartHelper.getCartCount(user._id);
			wishListCount = await wishListHelper.getWishListCount(user._id);
			res.status(202).json({
				status: "success",
				message: "product added to cart",
			});
		}
	} catch (error) {
		next(error);
	}
};

const incDecQuantity = async (req, res, next) => {
	try {
		let obj = {};
		let user = req.session.user;
		let productId = req.body.productId;
		let quantity = req.body.quantity;

		response = await cartHelper.incDecProductQuantity(
			user._id,
			productId,
			quantity
		);

		obj.quantity = response.newQuantity;

		let cartItems = await cartHelper.getAllCartItems(user._id);
		obj.totalAmount = await cartHelper.totalSubtotal(user._id, cartItems);

		obj.totalAmount = formatCurrency(obj.totalAmount);

		if (response.isOutOfStock) {
			res.status(202).json({ OutOfStock: true, message: obj });
		} else {
			res.status(202).json({ OutOfStock: false, message: obj });
		}
	} catch (error) {
		next(error);
	}
};

const removeFromCart = async (req, res, next) => {
	const userId = req.session.user._id;
	const cartId = req.body.cartId;
	const productId = req.params.id;
	try {
		await cartHelper.removeAnItemFromCart(cartId, productId);

		let cartItems = await cartHelper.getAllCartItems(userId);
		let totalAmount = await cartHelper.totalSubtotal(userId, cartItems);
		totalAmount = formatCurrency(totalAmount);

		let cartCount = await cartHelper.getCartCount(userId);
		wishListCount = await wishListHelper.getWishListCount(userId);
		res.status(202).json({
			message: "sucessfully item removed",
			totalAmount,
			cartCount,
			wishListCount,
		});
	} catch (error) {
		next(error);
	}
};

const addAddress = async (req, res, next) => {
	try {
		await addressHelper.addAddress(req.body);
		res.status(202).json({ message: "address added successfully" });
	} catch (error) {
		next(error);
	}
};

const editAddress = async (req, res, next) => {
	try {
		let address = await addressHelper.getAnAddress(req.params.id);
		res.status(200).json({ address });
	} catch (error) {
		next(error);
	}
};

const editAddressPost = async (req, res, next) => {
	try {
		await addressHelper.editAnAddress(req.body);
		res.json({ message: "address updated" });
	} catch (error) {
		next(error);
	}
};

const deleteAddressPost = async (req, res, next) => {
	try {
		await addressHelper.deleteAnAddress(req.params.id);
		res.json({ message: "address Deleted Successfully.." });
	} catch (error) {
		next(error);
	}
};

const checkout = async (req, res, next) => {
	//to view details and price products that are going to order and manage address
	try {
		const user = req.session.user;

		let cartItems = await cartHelper.getAllCartItems(user._id);
		let walletBalance = await walletHelper.walletBalance(user._id);
		walletBalance = formatCurrency(walletBalance);

		let totalAmount = await cartHelper.totalSubtotal(user._id, cartItems);
		totalAmount = totalAmount.toLocaleString("en-in", {
			style: "currency",
			currency: "INR",
		});
		const userAddress = await addressHelper.findAddresses(user._id);

		for (let i = 0; i < cartItems.length; i++) {
			cartItems[i].product.product_price = cartItems[
				i
			].product.product_price.toLocaleString("en-in", {
				style: "currency",
				currency: "INR",
				maximumFractionDigits: 0,
			});
		}

		res.render("user/checkout", {
			loginStatus: req.session.user,
			cartCount,
			wishListCount,
			walletBalance,
			user,
			totalAmount: totalAmount,
			cartItems,
			address: userAddress,
		}); //loginstatus contain user login info
	} catch (error) {
		next(error);
	}
};

const applyCoupon = async (req, res, next) => {
	try {
		const user = req.session.user;
		const { totalAmount, couponCode } = req.body;
		const response = await couponHelper.applyCoupon(user._id, couponCode);

		res.status(202).json(response);
	} catch (error) {
		next(error);
	}
};

const placeOrder = async (req, res, next) => {
	try {
		let userId = req.body.userId;
		let paymentType = req.body.payment;
		let cartItems = await cartHelper.getAllCartItems(userId);
		let coupon = await couponSchema.find({ user: userId });

		if (!cartItems.length)
			return res.json({
				error: true,
				message: "Please add items to cart before checkout",
			});

		if (req.body.addressSelected == undefined)
			return res
				.status(400)
				.json({ error: true, message: "Please Choose Address" });

		if (paymentType == undefined)
			return res.status(400).json({
				error: true,
				message: "Please Choose A Payment Method",
			});

		const totalAmount = await cartHelper.totalAmount(userId);

		switch (paymentType) {
			case "COD":
				const orderDetailsCOD = await orderHelper.orderPlacing(
					req.body,
					totalAmount,
					cartItems
				);
				await productHelper.decreaseStock(cartItems);
				await cartHelper.clearCart(userId);
				res.status(202).json({
					paymentMethod: "COD",
					message: "Purchase Done",
				});
				break;
			case "razorpay":
				const orderDetailsRazorpay = await orderHelper.orderPlacing(
					req.body,
					totalAmount,
					cartItems
				);
				const razorpayOrderDetails = await razorpay.razorpayOrderCreate(
					orderDetailsRazorpay._id,
					orderDetailsRazorpay.totalAmount
				);
				await orderHelper.changeOrderStatus(
					orderDetailsRazorpay._id,
					"confirmed"
				);
				await productHelper.decreaseStock(cartItems);
				await cartHelper.clearCart(userId);
				res.json({
					paymentMethod: "razorpay",
					orderDetails: orderDetailsRazorpay,
					razorpayOrderDetails,
					razorpaykeyId: process.env.RAZORPAY_KEY_ID,
				});
				break;
			case "wallet":
				let isPaymentDone = await walletHelper.payUsingWallet(
					userId,
					totalAmount
				);
				if (isPaymentDone) {
					const orderDetailsWallet = await orderHelper.orderPlacing(
						req.body,
						totalAmount,
						cartItems
					);
					await orderHelper.changeOrderStatus(
						orderDetailsWallet._id,
						"confirmed"
					);
					await productHelper.decreaseStock(cartItems);
					await cartHelper.clearCart(userId);
					res.status(202).json({
						paymentMethod: "wallet",
						error: false,
						message: "Purchase Done",
					});
				} else {
					res.status(200).json({
						paymentMethod: "wallet",
						error: true,
						message: "Insufficient Balance in wallet",
					});
				}
				break;
			default:
				// Handle default case if needed
				break;
		}
	} catch (error) {
		console.error("Error processing payment:", error);
		next(error);
	}
};

//razorpay payment verification
const verifyPayment = async (req, res, next) => {
	const userId = req.session.user._id;
	try {
		const response = await razorpay.verifyPaymentSignature(req.body);
		if (response.signatureIsValid) {
			await orderHelper.changeOrderStatus(
				req.body["orderDetails[_id]"],
				"confirmed"
			);
			let cartItems = await cartHelper.getAllCartItems(userId);
			await productHelper.decreaseStock(cartItems);
			await cartHelper.clearCart(userId);

			res.status(200).json({ status: true });
		} else {
			res.status(200).json({ status: false });
		}
	} catch (error) {
		next(error);
	}
};

const orderSuccess = (req, res, next) => {
	try {
		res.render("user/order-success", { loginStatus: req.session.user });
	} catch (error) {
		next(error);
	}
};

//to find all orders details of a user
const orders = async (req, res, next) => {
	try {
		const user = req.session.user;
		const userOrderDetails = await orderHelper.getAllOrderDetailsOfAUser(
			user._id
		);
		for (let i = 0; i < userOrderDetails.length; i++) {
			userOrderDetails[i].orderDate = formatDate(
				userOrderDetails[i].orderDate
			);
			userOrderDetails[i].totalAmount = formatCurrency(
				userOrderDetails[i].totalAmount
			);
		}
		res.render("user/orders-user", {
			userOrderDetails,
			loginStatus: req.session.user,
			cartCount,
			wishListCount,
		});
	} catch (error) {
		next(error);
	}
};

const productOrderDetails = async (req, res, next) => {
	try {
		const orderId = req.params.id;
		let orderDetails = await orderHelper.getOrderedUserDetailsAndAddress(
			orderId
		); //got user details
		let productDetails = await orderHelper.getOrderedProductsDetails(
			orderId
		); //got ordered products details
		res.render("user/order-details-user", {
			orderDetails,
			cartCount,
			wishListCount,
			productDetails,
			loginStatus: req.session.user,
			formatCurrency,
		});
	} catch (error) {
		next(error);
	}
};

const cancelOrder = async (req, res, next) => {
	const userId = req.body.userId;
	const orderId = req.body.orderId;
	try {
		await orderHelper.cancelOrder(userId, orderId);
		res.status(200).json({
			isCancelled: true,
			message: "order canceled successfully",
		});
	} catch (error) {
		next(error);
	}
};

const returnOrder = async (req, res, next) => {
	const userId = req.body.userId;
	const orderId = req.body.orderId;
	try {
		await orderHelper.returnOrder(userId, orderId);
		res.status(200).json({
			isreturned: "return pending",
			message: "order returned Process Started",
		});
	} catch (error) {
		next(error);
	}
};

const contact = (req, res) => {
	res.render("user/contact", {
		loginStatus: req.session.user,
		cartCount,
		wishListCount,
	});
};

const searchProduct = async (req, res, next) => {
	let payload = req.body.payload.trim();
	try {
		let searchResult = await productSchema
			.find({
				product_name: { $regex: new RegExp("^" + payload + ".*", "i") },
			})
			.exec();
		searchResult = searchResult.slice(0, 5);
		res.send({ searchResult });
	} catch (error) {
		next(error);
	}
};

const errorPage = (req, res) => {
	res.render("error");
};

module.exports = {
	landingPage,
	userHome,
	profile,
	userSignup,
	userSignupPost,
	userLogin,
	userLoginPost,
	forgotPassword,
	otpSendingForgot,
	otpVerifyingForgot,
	resetPassword,
	otpUser,
	otpSending,
	otpVerifying,
	getWallet,
	userLogout,
	viewProducts,
	viewAProduct,
	wishlist,
	addToWishList,
	removeFromWishList,
	cart,
	addToCart,
	incDecQuantity,
	removeFromCart,
	error,
	checkout,
	addAddress,
	editAddress,
	editAddressPost,
	deleteAddressPost,
	applyCoupon,
	placeOrder,
	verifyPayment,
	orderSuccess,
	orders,
	productOrderDetails,
	cancelOrder,
	returnOrder,
	contact,
	searchProduct,
	errorPage,
};
