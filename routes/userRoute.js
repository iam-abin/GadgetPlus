const express=require('express');
const router=express.Router();

const {userAuthenticationCheck,userChecking } = require('../middlewares/sessionHandling');

const categorySupply = require('../middlewares/categoryFetching');
// const cartCountSupply=require('../middlewares/cartUtility')

const userController=require('../controllers/userController');

// router.use(cartCountSupply);

router.use(categorySupply);

router.get('/',userAuthenticationCheck,userController.landingPage);

router.get('/user-home',userChecking,userController.userHome);

router.get('/user-signup',userAuthenticationCheck,userController.userSignup);

router.post('/user-signup',userController.userSignupPost);

router.get('/user-login',userAuthenticationCheck,userController.userLogin);

router.post('/user-login',userController.userLoginPost);


router.get('/otp-forgotPassword',userAuthenticationCheck,userController.forgotPassword)

router.post('/otp-forgotPassword',userAuthenticationCheck,userController.otpSendingForgot)

router.post('/otp-fill-forgotPassword',userAuthenticationCheck,userController.otpVerifyingForgot)

router.post('/change-password',userAuthenticationCheck,userController.resetPassword)


router.get('/otp-user',userAuthenticationCheck,userController.otpUser);

router.post('/otp-user',userController.otpSending);

router.post('/otp-fill',userController.otpVerifying);

router.get('/wallet',userChecking,userController.getWallet)

router.get('/user-logout',userChecking,userController.userLogout);

router.get('/error',userController.error)



router.get('/profile',userChecking,userController.profile)

router.get('/about',userController.about);

// router.get('/viewProducts/:id',userController.viewProducts);



router.get('/viewProducts',userController.viewProducts);



router.get('/quick-view/:slug',userController.viewAProduct);  //display 4 images with image zoom


router.get('/wishlist',userChecking,userController.wishlist);

router.post('/add-to-wishList',userChecking,userController.addToWishList);

router.post('/remove-from-wishList',userChecking,userController.removeFromWishList)



router.get('/cart',userChecking,userController.cart)

router.get('/add-to-cart/:id',userChecking,userController.addToCart)

router.post('/quantity-change',userChecking,userController.incDecQuantity)

router.post('/remove-cart-item/:id',userChecking,userController.removeFromCart)




router.post('/add-address',userChecking,userController.addAddress)

router.get('/edit-address/:id',userChecking,userController.editAddress)

router.post('/edit-address',userChecking,userController.editAddressPost)

router.post('/delete-address/:id',userChecking,userController.deleteAddressPost)


// ----------------------------------------------------------------------------------------------------

router.get('/checkout',userChecking,userController.checkout);

router.post('/apply-coupon',userChecking,userController.applyCoupon)

router.post('/place-order',userChecking,userController.placeOrder);

router.post('/verify-payment',userChecking,userController.verifyPayment)

router.get('/order-success',userChecking,userController.orderSuccess)
// ----------------------------------------------------------------------------------------------------

router.get('/orders',userChecking,userController.orders)

router.get('/order-details/:id',userChecking,userController.productOrderDetails)

router.post('/cancel-order',userChecking,userController.cancelOrder)

router.post('/return-order',userChecking,userController.returnOrder)

router.get('/contact',userController.contact)


router.post('/search-product',userController.searchProduct)


router.get('/error',userController.errorPage)

router.get('/404',userController.notFound404)

module.exports=router;