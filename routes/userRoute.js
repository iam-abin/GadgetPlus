const express=require('express');
const router=express.Router();

const userController=require('../controllers/userController')


router.get('/',userController.userHome);

router.get('/user-signup',userController.userSignup);

router.post('/user-signup',userController.userSignupPost);

router.get('/user-login',userController.userLogin);

router.post('/user-login',userController.userLoginPost);

router.get('/otp-user',userController.otpUser);

router.get('/user-logout',userController.userLogout);

router.get('/profile',userController.profile)

router.get('/about',userController.about);

router.get('/laptop',userController.laptop)

router.get('/mobile',userController.mobile)

router.get('/wishlist',userController.wishlist)

router.get('/cart',userController.cart)

router.get('/checkout',userController.checkout)

// router.get('/quickView',userController.quickView)

router.get('/add-address',userController.addAddress)

router.get('/edit-address',userController.editAddress)

router.get('/payment',userController.payment,)

router.get('/contact',userController.contact)

router.get('/order-details',userController.orderDetails)

router.get('/order-summery',userController.orderSummary)

router.get('/contact',userController.contact)




module.exports=router;