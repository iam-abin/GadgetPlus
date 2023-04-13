const express=require('express');
const router=express.Router();

const adminController=require('../controllers/adminController')


router.get('/',adminController.adminLogin);

router.post('/adminLogin',adminController.adminLoginPost);

router.get('/Logout',adminController.adminLogout)

// router.get('/',adminController.);

module.exports=router;