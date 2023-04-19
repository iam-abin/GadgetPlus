const express=require('express');
const router=express.Router();

const {adminAuthenticationChecking,adminChecking} = require('../middlewares/sessionHandling')
const adminController=require('../controllers/adminController');



router.get('/',adminAuthenticationChecking,adminController.adminLogin);

router.post('/adminLogin',adminController.adminLoginPost);

router.get('/users-List',adminChecking,adminController.usersList)

router.get('/product',adminChecking,adminController.productList);

router.get('/add-product',adminChecking,adminController.addProduct);

router.get('/orders',adminChecking,adminController.orders);

router.get('/banner',adminChecking,adminController.banners);

router.get('/coupon',adminChecking,adminController.coupons);

router.get('/Logout',adminController.adminLogout)


// router.get('/',adminController.);

module.exports=router;