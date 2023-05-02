const express=require('express');
const router=express.Router();

const {userAuthenticationCheck,userChecking } = require('../middlewares/sessionHandling');
const categorySupply = require('../middlewares/categoryFetching');

const userController=require('../controllers/userController');

router.use(categorySupply);

router.get('/',userAuthenticationCheck,userController.landingPage);

// router.get('/landing-page',userController.landingPage);

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


router.get('/user-logout',userChecking,userController.userLogout);

router.get('/error',userController.error)



router.get('/profile',userChecking,userController.profile)

router.get('/about',userController.about);

router.get('/viewProduct/:id',userController.viewProduct);

router.get('/wishlist',userChecking,userController.wishlist)



router.get('/cart',userChecking,userController.cart)

router.get('/add-to-cart/:id',userChecking,userController.addToCart)

router.get('/remove-cart-item/:id',userChecking,userController.removeFromCart)



router.get('/checkout',userChecking,userController.checkout)

// router.get('/quickView',userController.quickView)

router.post('/add-address',userChecking,userController.addAddress)

router.get('/edit-address',userChecking,userController.editAddress)

router.get('/payment',userChecking,userController.payment,)

router.get('/order-details',userChecking,userController.orderDetails)

router.get('/order-summery',userChecking,userController.orderSummary)

router.get('/contact',userController.contact)



router.get('/404',userController.notFound404)

module.exports=router;