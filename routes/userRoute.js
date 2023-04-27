const express=require('express');
const router=express.Router();
const {userAuthenticationCheck,userChecking } = require('../middlewares/sessionHandling');

const userController=require('../controllers/userController');



router.get('/',userAuthenticationCheck,userController.landingPage);

// router.get('/landing-page',userController.landingPage);

router.get('/user-home',userChecking,userController.userHome);

router.get('/user-signup',userController.userSignup);

router.post('/user-signup',userController.userSignupPost);

router.get('/user-login',userAuthenticationCheck,userController.userLogin);

router.post('/user-login',userController.userLoginPost);

router.get('/otp-user',userController.otpUser);

router.post('/otp-user',userController.otpSending);

router.post('/otp-fill',userController.otpVerifying);

router.get('/user-logout',userController.userLogout);

router.get('/error',userController.error)



router.get('/profile',userChecking,userController.profile)

router.get('/about',userController.about);

router.get('/phone',userController.Phone);

router.get('/laptop',userController.laptop);

router.get('/tab',userController.tab);

router.get('/smartWatch',userController.smartWatch);

router.get('/wishlist',userController.wishlist)

router.get('/cart',userController.cart)

router.get('/checkout',userChecking,userController.checkout)

// router.get('/quickView',userController.quickView)

router.get('/add-address',userController.addAddress)

router.get('/edit-address',userController.editAddress)

router.get('/payment',userController.payment,)

router.get('/contact',userController.contact)

router.get('/order-details',userController.orderDetails)

router.get('/order-summery',userController.orderSummary)

router.get('/contact',userController.contact)



router.get('/404',userController.notFound404)

module.exports=router;