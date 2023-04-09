const express=require('express');
const router=express.Router();

const adminController=require('../controllers/adminController')


router.get('/',adminController.adminHome);

router.get('/admin-login',adminController.adminLogin);

module.exports=router;