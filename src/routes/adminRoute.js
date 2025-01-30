const express = require("express");
const router = express.Router();

const {
	adminAuthenticationChecking,
	adminChecking,
} = require("../middlewares/sessionHandling");
const multer = require("../middlewares/multer");
const adminHomeController = require("../controllers/home/admin.home.controller");
const adminProductController = require("../controllers/admin/product.controller");
const adminCategoryController = require("../controllers/admin/category.controller");
const adminCouponController = require("../controllers/admin/coupon.controller");
const adminOrderController = require("../controllers/admin/order.controller");
const adminUserController = require("../controllers/admin/user.controller");
const adminReportController = require("../controllers/admin/report.controller");
const adminAuthController = require("../controllers/auth/admin.auth.controller");

// Login routes
router.get("/", adminAuthenticationChecking, adminAuthController.adminLogin);

router.post("/adminLogin", adminAuthController.adminLoginPost);

// Homepage route
router.get("/admin-home", adminChecking, adminHomeController.adminHome);

// Sales Report routes
router.get(
	"/sales-report-page",
	adminChecking,
	adminReportController.salesReportPage
);

router.post("/sales-report", adminChecking, adminReportController.salesReport);

// User Management routes
router.get("/users-List", adminChecking, adminUserController.usersList);

router.get(
	"/block-unblock-user/:id",
	adminChecking,
	adminUserController.blockUnBlockUser
);

// Product Management routes
router.get("/product", adminChecking, adminProductController.productList);

router.get("/add-product", adminChecking, adminProductController.addProduct);

router.post(
	"/add-product",
	adminChecking,
	multer.productUpload,
	adminProductController.postAddProduct
);

router.get("/edit-product/:slug", adminChecking, adminProductController.editProduct);

router.post(
	"/edit-product/:slug",
	adminChecking,
	multer.productUpload,
	adminProductController.postEditProduct
);

router.get(
	"/delete-product/:slug",
	adminChecking,
	adminProductController.deleteProduct
);

// Category Management routes
router.get(
	"/product-categories",
	adminChecking,
	adminCategoryController.productCategory
);

router.post(
	"/add-productCategory",
	adminChecking,
	adminCategoryController.postAddProductCategory
);

router.get(
	"/edit-productCategory/:id",
	adminChecking,
	adminCategoryController.editProductCategory
);

router.post(
	"/edit-productCategoryPost",
	adminChecking,
	adminCategoryController.editProductCategoryPost
);

router.get(
	"/delete-productCategory/:id",
	adminChecking,
	adminCategoryController.deleteProductCategory
);

// Order Management routes
router.get("/orders", adminChecking, adminOrderController.productOrders);

router.post(
	"/order-status",
	adminChecking,
	adminOrderController.changeProductOrderStatus
);

router.get(
	"/order-details/:id",
	adminChecking,
	adminOrderController.productOrderDetails
);

// Coupon Management routes
router.get("/coupon", adminChecking, adminCouponController.coupons);

router.post("/add-coupon", adminChecking, adminCouponController.postAddCoupon);

router.get("/edit-coupon/:id", adminChecking, adminCouponController.editCoupon);

router.post("/edit-coupon", adminChecking, adminCouponController.editCouponPost);

router.get("/delete-coupon/:id", adminChecking, adminCouponController.deleteCoupon);

// Profile Route
router.get("/userProfile/:id", adminChecking, adminUserController.userProfile);

// Logout Route
router.get("/logout", adminAuthController.adminLogout);

module.exports = router;
