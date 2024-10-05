const express=require('express');
const router=express.Router();

const {userAuthenticationCheck,userChecking } = require('../middlewares/sessionHandling');
const categorySupply = require('../middlewares/categoryFetching');

const userHomeController=require('../controllers/home/user.home.controller');
const userAuthController=require('../controllers/auth/user.auth.controller');
const userOtpController=require('../controllers/user/otp.controller');
const userPasswordController=require('../controllers/user/password.controller');
const userWalletController=require('../controllers/user/wallet.controller');
const userProductController=require('../controllers/user/product.controller');
const userOrderController=require('../controllers/user/order.controller');
const userWishlistController=require('../controllers/user/wishlist.controller');
const userCartController=require('../controllers/user/cart.controller');
const userAddressController=require('../controllers/user/address.controller');
const userCouponController=require('../controllers/user/coupon.controller');
const userPaymentController=require('../controllers/user/payment.controller');
const userProfileController=require('../controllers/profile/user.profile.controller');
const errorController=require('../controllers/error/error.controller');

const cartWishlistCount = require('../middlewares/cartWishlistCount');

// middleware that is used to fetch filter categories
// its better to use localstorage than this middleware
router.use(categorySupply);
router.use(cartWishlistCount)

router.get('/',userAuthenticationCheck,userHomeController.landingPage);

router.get('/user-home',userChecking,userHomeController.userHome);

router.get('/user-signup',userAuthenticationCheck,userAuthController.userSignup);

router.post('/user-signup',userAuthController.userSignupPost);

router.get('/user-login',userAuthenticationCheck,userAuthController.userLogin);

router.post('/user-login',userAuthController.userLoginPost);

router.get('/user-logout',userChecking,userAuthController.userLogout);


router.get('/otp-forgotPassword',userAuthenticationCheck,userPasswordController.forgotPassword)

router.post('/otp-forgotPassword',userAuthenticationCheck,userOtpController.otpSendingForgot)

router.post('/otp-fill-forgotPassword',userAuthenticationCheck,userOtpController.otpVerifyingForgot)

router.post('/change-password',userAuthenticationCheck,userPasswordController.resetPassword)


// route to render otp page
router.get('/otp-user',userAuthenticationCheck,userOtpController.otpUser);

router.post('/otp-user',userOtpController.otpSending);

router.post('/otp-fill',userOtpController.otpVerifying);


router.get('/wallet',userChecking,userWalletController.getWallet)


router.get('/profile',userChecking,userProfileController.profile)

// product routes

router.get('/viewProducts',userProductController.viewProducts);

router.post('/search-product',userProductController.searchProduct)

router.get('/quick-view/:slug',userProductController.viewAProduct);  //display 4 images with image zoom


// wishlist routes
router.get('/wishlist',userChecking,userWishlistController.wishlist);

router.post('/add-to-wishList',userChecking,userWishlistController.addToWishList);

router.post('/remove-from-wishList',userChecking,userWishlistController.removeFromWishList)


// cart routes
router.get('/cart',userChecking,userCartController.cart)

router.post('/add-to-cart/:id',userChecking,userCartController.addToCart)

router.post('/quantity-change',userChecking,userCartController.incDecQuantity)

router.post('/remove-cart-item/:id',userChecking,userCartController.removeFromCart)


// address routes
router.post('/add-address',userChecking,userAddressController.addAddress)

router.get('/edit-address/:id',userChecking,userAddressController.editAddress)

router.post('/edit-address',userChecking,userAddressController.editAddressPost)

router.post('/delete-address/:id',userChecking,userAddressController.deleteAddressPost)


// payment routes
router.get('/checkout',userChecking,userPaymentController.checkout);

router.post('/apply-coupon',userChecking,userCouponController.applyCoupon)

router.post('/place-order',userChecking,userOrderController.placeOrder);

router.post('/verify-payment',userChecking,userPaymentController.verifyPayment)

router.get('/order-success',userChecking,userOrderController.orderSuccess)


// order routes
router.get('/orders',userChecking,userOrderController.orders)

router.get('/order-details/:id',userChecking,userOrderController.productOrderDetails)

router.post('/cancel-order',userChecking,userOrderController.cancelOrder)

router.post('/return-order',userChecking,userOrderController.returnOrder)


// contact page route
router.get('/contact',userHomeController.contact)


// error page route 
router.get('/error',errorController.errorPage)


module.exports=router;