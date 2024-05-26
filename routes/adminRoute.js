const express=require('express');
const router=express.Router();

const {adminAuthenticationChecking,adminChecking} = require('../middlewares/sessionHandling')
const multer=require('../middlewares/multer')
const adminController=require('../controllers/adminController');



router.get('/',adminAuthenticationChecking,adminController.adminLogin);

router.post('/adminLogin',adminController.adminLoginPost);

router.get('/admin-home',adminChecking,adminController.adminHome)

// Sales Report Routes
router.get('/sales-report-page',adminChecking,adminController.salesReportPage);

router.post('/sales-report',adminChecking,adminController.salesReport);

// User Management Routes
router.get('/users-List',adminChecking,adminController.usersList);

router.get('/block-unblock-user/:id',adminChecking,adminController.blockUnBlockUser);


// Product Management Routes
router.get('/product',adminChecking,adminController.productList); 

router.get('/add-product',adminChecking,adminController.addProduct);

router.post('/add-product',adminChecking,multer.productUpload,adminController.postAddProduct);

router.get('/edit-product/:slug',adminChecking,adminController.editProduct);

router.post('/edit-product/:slug',adminChecking,multer.productUpload,adminController.postEditProduct)

router.get('/delete-product/:slug',adminChecking,adminController.deleteProduct);

// Category Management Routes
router.get('/product-categories',adminChecking,adminController.productCategory); 

router.post('/add-productCategory',adminChecking,adminController.postAddProductCategory);

router.get('/edit-productCategory/:id',adminChecking,adminController.editProductCategory);

router.post('/edit-productCategoryPost',adminChecking,adminController.editProductCategoryPost);

router.get('/delete-productCategory/:id',adminChecking,adminController.deleteProductCategory)

// Order Management Routes
router.get('/orders',adminChecking,adminController.productOrders);

router.post('/order-status',adminChecking,adminController.changeProductOrderStatus);

router.get('/order-details/:id',adminChecking,adminController.productOrderDetails);

// Banner Route
router.get('/banner',adminChecking,adminController.banners);

// Coupon Management Routes
router.get('/coupon',adminChecking,adminController.coupons);

router.post('/add-coupon',adminChecking,adminController.postAddCoupon)

router.get('/edit-coupon/:id',adminChecking,adminController.editCoupon)

router.post('/edit-coupon',adminChecking,adminController.editCouponPost)

router.get('/delete-coupon/:id',adminChecking,adminController.deleteCoupon)

// user Profile Route
router.get('/userProfile/:id',adminChecking,adminController.userProfile);

// Logout Route
router.get('/logout',adminController.adminLogout)


module.exports=router;