const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelper");
const categoryHelper = require("../helpers/categoryHelper");
const orderHelper = require("../helpers/orderHepler");
const coupenHelper = require("../helpers/coupenHelper");
const orderHepler = require("../helpers/orderHepler");
const walletHelper = require("../helpers/walletHelper");

// var easyinvoice = require("easyinvoice");
// const csvParser = require("json-2-csv");

const { formatDate } = require("../utils/date-format");
const { currencyFormatWithoutDecimal } = require("../utils/currency-format");

const { ADMIN_LAYOUT } = require("../config/constants");

const adminLogin = async (req, res, next) => {
	try {
		res.render("admin/adminLogin", {
			layout: ADMIN_LAYOUT,
			admin: true,
		});
	} catch (error) {
		next(error);
	}
};

const adminLoginPost = async (req, res, next) => {
	const adminName = req.body.email; //email
	const adminPassword = req.body.password;
	try {
		const adminDetails = await adminHelper.isAdminExists(
			adminName,
			adminPassword
		);
		if (adminDetails) {
			req.session.admin = adminDetails;
		}
		// If admin details are correct the go to admin home page else will go to login page.
		res.redirect("/admin");
	} catch (error) {
		next(error);
	}
};

const adminHome = async (req, res, next) => {
	try {
		const orderStatus = await orderHelper.getAllOrderStatusesCount();
		const chartData = await adminHelper.getChartDetails();
		const dashboardDetails = await adminHelper.getDashboardDetails();

		dashboardDetails.totalRevenue = dashboardDetails.totalRevenue
			? currencyFormatWithoutDecimal(dashboardDetails.totalRevenue)
			: 0;
		dashboardDetails.monthlyRevenue = dashboardDetails.monthlyRevenue
			? currencyFormatWithoutDecimal(dashboardDetails.monthlyRevenue)
			: 0;

		res.render("admin/admin-home", {
			orderStatus,
			chartData,
			dashboardDetails,
			layout: ADMIN_LAYOUT,
		});
	} catch (error) {
		next(error);
	}
};

const salesReportPage = async (req, res, next) => {
	try {
		const sales = await orderHelper.getAllDeliveredOrders();
		sales.forEach((order) => {
			order.orderDate = formatDate(order.orderDate);
		});
		res.render("admin/sales-report", {
			sales,
			layout: ADMIN_LAYOUT,
		});
	} catch (error) {
		next(error);
	}
};

const salesReport = async (req, res, next) => {
	try {
		let { startDate, endDate } = req.body;

		startDate = new Date(startDate);
		endDate = new Date(endDate);

		const salesReport = await orderHelper.getAllDeliveredOrdersByDate(
			startDate,
			endDate
		);
		for (let i = 0; i < salesReport.length; i++) {
			salesReport[i].orderDate = formatDate(salesReport[i].orderDate);
			salesReport[i].totalAmount = currencyFormatWithoutDecimal(
				salesReport[i].totalAmount
			);
		}
		res.status(200).json({ sales: salesReport });
	} catch (error) {
		next(error);
	}
};

const usersList = async (req, res, next) => {
	await adminHelper
		.findUsers()
		.then((response) => {
			res.status(200).render("admin/users-list", {
				layout: ADMIN_LAYOUT,
				users: response,
			});
		})
		.catch((error) => {
			return next(error);
		});
};

const blockUnBlockUser = async (req, res, next) => {
	const userId = req.params.id;
	await adminHelper
		.blockOrUnBlockUser(userId)
		.then((result) => {
			if (result.isActive) {
				res.status(200).json({
					error: false,
					message: "User has been unBlocked",
					user: result,
				});
			} else {
				req.session.user = false;

				res.status(200).json({
					error: false,
					message: "User has been Blocked",
					user: result,
				});
			}
		})
		.catch((error) => {
			return next(error);
		});
};

const productList = (req, res, next) => {
	productHelper
		.getAllProductsWithLookup()
		.then((responseProduct) => {
			for (let i = 0; i < responseProduct.length; i++) {
				responseProduct[i].product_price = currencyFormatWithoutDecimal(
					responseProduct[i].product_price
				);
				responseProduct[i].product_discount =
					currencyFormatWithoutDecimal(
						responseProduct[i].product_discount
					);
			}

			res.render("admin/products-list", {
				layout: ADMIN_LAYOUT,
				products: responseProduct,
			});
		})
		.catch((error) => {
			return next(error);
		});
};

// To get add product list and product page.
const addProduct = async (req, res, next) => {
	try {
		const product = await categoryHelper.getAllcategory();

		res.render("admin/add-product", {
			layout: ADMIN_LAYOUT,
			category: product,
		});
	} catch (error) {
		next(error);
	}
};

const postAddProduct = async (req, res, next) => {
	const category = await categoryHelper.getAcategory(
		req.body.product_category
	);
	if (!category) throw new Error("Given category is not Present");

	try {
		await productHelper.addProductToDb(req.body, req.files);

		res.status(201).redirect("/admin/product");
	} catch (error) {
		next(error);
	}
};

const editProduct = async (req, res, next) => {
	try {
		const product = await productHelper.getAProduct(req.params.slug);
		const categories = await categoryHelper.getAllcategory();

		if (product == "") {
			res.status(401).redirect("/admin");
		} else {
			res.status(200).render("admin/edit-product", {
				product,
				categories,
				layout: ADMIN_LAYOUT,
			});
		}
	} catch (error) {
		return next(error);
	}
};

const postEditProduct = async (req, res, next) => {
	try {
		await productHelper.postEditAProduct(
			req.body,
			req.params.slug,
			req.file
		);

		res.status(200).redirect("/admin/product");
	} catch (error) {
		next(error);
	}
};

// List and unlist product
const deleteProduct = async (req, res, next) => {
	try {
		const result = await productHelper.softDeleteProduct(req.params.slug);

		if (result.product_status) {
			res.status(200).json({
				error: false,
				message: "product unblocked ",
				product: result,
			});
		} else {
			res.status(200).json({
				error: false,
				message: "product deleted",
				product: result,
			});
		}
	} catch (error) {
		next(error);
	}
};

const productCategory = async (req, res, next) => {
	try {
		const category = await categoryHelper.getAllcategory();
		res.render("admin/product-categories", {
			layout: ADMIN_LAYOUT,
			categories: category,
		});
	} catch (error) {
		next(error);
	}
};

const postAddProductCategory = async (req, res) => {
	try {
		await categoryHelper.addCategoryTooDb(req.body);
		res.status(200).redirect("/admin/product-categories");
	} catch (error) {
		if (error.code === 11000) {
			res.status(200).json({
				error: true,
				message: "Category already Exist!!!",
			});
		} else {
			res.status(500).redirect("/error");
		}
	}
};

const editProductCategory = async (req, res, next) => {
	try {
		const editedCatrgory = await categoryHelper.getAcategory(req.params.id);
		res.status(200).json({ category: editedCatrgory });
	} catch (error) {
		next(error);
	}
};

const editProductCategoryPost = (req, res) => {
	categoryHelper
		.editCategory(req.body)
		.then((response) => {
			res.status(202).json({ message: "category updated" });
		})
		.catch((error) => {
			if (error.code === 11000) {
				res.status(500).json({
					error: true,
					message: "Category already Exist!!!",
				});
			} else {
				res.status(500).redirect("/error");
			}
		});
};

const deleteProductCategory = (req, res, next) => {
	categoryHelper
		.softDeleteAProductCategory(req.params.id)
		.then((response) => {
			if (response.status) {
				res.status(200).json({
					error: false,
					message: "category listed",
					listed: true,
				});
			} else {
				res.status(200).json({
					error: false,
					message: "category unlisted",
					listed: false,
				});
			}
		})
		.catch((error) => {
			next(error);
		});
};

const productOrders = async (req, res, next) => {
	try {
		let orders = await orderHelper.getAllOrders();
		for (let i = 0; i < orders.length; i++) {
			orders[i].totalAmount = currencyFormatWithoutDecimal(
				orders[i].totalAmount
			);
			orders[i].orderDate = formatDate(orders[i].orderDate);
		}
		res.render("admin/orders", { layout: ADMIN_LAYOUT, orders });
	} catch (error) {
		next(error);
	}
};

const changeProductOrderStatus = async (req, res, next) => {
	try {
		const response = await orderHepler.changeOrderStatus(
			req.body.orderId,
			req.body.status
		);

		if (response.orderStatus == "returned") {
			await walletHelper.addMoneyToWallet(
				response.user,
				response.totalAmount
			);
			await productHelper.increaseStock(response);
		}
		res.status(202).json({
			error: false,
			message: "order status updated",
			status: response.orderStatus,
		});
	} catch (error) {
		next(error);
	}
};

const productOrderDetails = async (req, res, next) => {
	try {
		const orderId = req.params.id;
		let orderdetails = await orderHelper.getOrderedUserDetailsAndAddress(
			orderId
		); //got user details
		let productDetails = await orderHelper.getOrderedProductsDetails(
			orderId
		); //got ordered products details

		for (let i = 0; i < orderdetails.length; i++) {
			orderdetails[i].discount = currencyFormatWithoutDecimal(
				orderdetails[i].discount
			);
		}

		for (let i = 0; i < productDetails.length; i++) {
			productDetails[i].orderedProduct.totalPriceOfOrderedProducts =
				currencyFormatWithoutDecimal(
					productDetails[i].orderedProduct.product_price *
						productDetails[i].orderedItems.quantity
				);
			productDetails[i].orderedProduct.product_price =
				currencyFormatWithoutDecimal(
					productDetails[i].orderedProduct.product_price
				);
		}

		orderdetails.totalAmount = currencyFormatWithoutDecimal(
			orderdetails.totalAmount
		);
		res.render("admin/order-details", {
			orderdetails,
			productDetails,
			layout: ADMIN_LAYOUT,
		});
	} catch (error) {
		next(error);
	}
};

const banners = (req, res) => {
	res.render("admin/banner", { layout: ADMIN_LAYOUT });
};

const coupons = async (req, res, next) => {
	try {
		let allCoupons = await coupenHelper.getAllCoupons();

		for (let i = 0; i < allCoupons.length; i++) {
			allCoupons[i].discount = currencyFormatWithoutDecimal(
				allCoupons[i].discount
			);
			allCoupons[i].expiryDate = formatDate(allCoupons[i].expiryDate);
		}
		res.render("admin/coupon", {
			coupons: allCoupons,
			layout: ADMIN_LAYOUT,
		});
	} catch (error) {
		next(error);
	}
};

const postAddCoupon = async (req, res, next) => {
	try {
		await coupenHelper.addCouponToDb(req.body);
		res.status(201).redirect("/admin/coupon");
	} catch (error) {
		next(error);
	}
};

// To show the coupon data to edit
const editCoupon = async (req, res, next) => {
	try {
		const couponData = await coupenHelper.getACoupenData(req.params.id);
		res.status(200).json({ couponData });
	} catch (error) {
		next(error);
	}
};

// To update coupon changes
const editCouponPost = async (req, res, next) => {
	try {
		await coupenHelper.editCoupon(req.body);
		res.status(201).redirect("/admin/coupon");
	} catch (error) {
		next(error);
	}
};

const deleteCoupon = async (req, res, next) => {
	try {
		await coupenHelper.deleteACoupon(req.params.id);
		res.status(200).json({ message: "coupon deleted successfully" });
	} catch (error) {
		next(error);
	}
};

const userProfile = async (req, res, next) => {
	try {
		const userOrderDetails = await orderHelper.getAllOrderDetailsOfAUser(
			req.params.id
		);
		for (let i = 0; i < userOrderDetails.length; i++) {
			userOrderDetails[i].totalAmount = currencyFormatWithoutDecimal(
				userOrderDetails[i].totalAmount
			);
			userOrderDetails[i].orderDate = formatDate(
				userOrderDetails[i].orderDate
			);
		}
		await adminHelper.findAUser(req.params.id).then((response) => {
			res.render("admin/user-profile", {
				layout: ADMIN_LAYOUT,
				user: response,
				userOrderDetails,
			});
		});
	} catch (error) {
		next(error);
	}
};

const adminLogout = (req, res) => {
	req.session.admin = false;
	res.redirect("/admin");
};

module.exports = {
	adminLogin,
	adminLoginPost,
	adminHome,
	salesReportPage,
	salesReport,
	adminLogout,
	usersList,
	blockUnBlockUser,
	productList,
	addProduct,
	postAddProduct,
	editProduct,
	postEditProduct,
	productCategory,
	deleteProduct,
	postAddProductCategory,
	editProductCategory,
	editProductCategoryPost,
	deleteProductCategory,
	productOrders,
	changeProductOrderStatus,
	productOrderDetails,
	banners,
	coupons,
	postAddCoupon,
	editCoupon,
	editCouponPost,
	deleteCoupon,
	userProfile,
	formatDate,
};
