const express=require('express');
const router=express.Router();

const adminController=require('../controllers/adminController')


router.get('/',adminController.adminLogin);

router.post('/adminLogin',adminController.adminLoginPost);

router.get('/users-List',adminController.usersList)

router.get('/product',adminController.productList);

router.get('/add-product',adminController.addProduct);

router.get('/orders',adminController.orders);

router.get('/banner',adminController.banners);

router.get('/coupon',adminController.coupons);

router.get('/Logout',adminController.adminLogout)


// router.get('/',adminController.);

module.exports=router;