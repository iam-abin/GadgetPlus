const express=require('express');
const router=express.Router();

const {userAuthenticationCheck,userChecking } = require('../middlewares/sessionHandling');
const categorySupply = require('../middlewares/categoryFetching');

const userController=require('../controllers/userController');

// middleware that is used to fetch filter categories
// its better to use localstorage than this middleware
router.use(categorySupply);


router.get('/',userAuthenticationCheck,userController.landingPage);

router.get('/user-home',userChecking,userController.userHome);

router.get('/user-signup',userAuthenticationCheck,userController.userSignup);

router.post('/user-signup',userController.userSignupPost);

router.get('/user-login',userAuthenticationCheck,userController.userLogin);

router.post('/user-login',userController.userLoginPost);

router.get('/user-logout',userChecking,userController.userLogout);


router.get('/otp-forgotPassword',userAuthenticationCheck,userController.forgotPassword)

router.post('/otp-forgotPassword',userAuthenticationCheck,userController.otpSendingForgot)

router.post('/otp-fill-forgotPassword',userAuthenticationCheck,userController.otpVerifyingForgot)

router.post('/change-password',userAuthenticationCheck,userController.resetPassword)


// route to render otp page
router.get('/otp-user',userAuthenticationCheck,userController.otpUser);

router.post('/otp-user',userController.otpSending);

router.post('/otp-fill',userController.otpVerifying);


router.get('/wallet',userChecking,userController.getWallet)


router.get('/profile',userChecking,userController.profile)


router.get('/viewProducts',userController.viewProducts);

router.post('/search-product',userController.searchProduct)

router.get('/quick-view/:slug',userController.viewAProduct);  //display 4 images with image zoom


// wishlist routes
router.get('/wishlist',userChecking,userController.wishlist);

router.post('/add-to-wishList',userChecking,userController.addToWishList);

router.post('/remove-from-wishList',userChecking,userController.removeFromWishList)


// cart routes
router.get('/cart',userChecking,userController.cart)

router.get('/add-to-cart/:id',userChecking,userController.addToCart)

router.post('/quantity-change',userChecking,userController.incDecQuantity)

router.post('/remove-cart-item/:id',userChecking,userController.removeFromCart)


// address routes
router.post('/add-address',userChecking,userController.addAddress)

router.get('/edit-address/:id',userChecking,userController.editAddress)

router.post('/edit-address',userChecking,userController.editAddressPost)

router.post('/delete-address/:id',userChecking,userController.deleteAddressPost)


// payment routes
router.get('/checkout',userChecking,userController.checkout);

router.post('/apply-coupon',userChecking,userController.applyCoupon)

router.post('/place-order',userChecking,userController.placeOrder);

router.post('/verify-payment',userChecking,userController.verifyPayment)

router.get('/order-success',userChecking,userController.orderSuccess)


// order routes
router.get('/orders',userChecking,userController.orders)

router.get('/order-details/:id',userChecking,userController.productOrderDetails)

router.post('/cancel-order',userChecking,userController.cancelOrder)

router.post('/return-order',userChecking,userController.returnOrder)


// contact page route
router.get('/contact',userController.contact)


// error page route 
router.get('/error',userController.errorPage)


module.exports=router;