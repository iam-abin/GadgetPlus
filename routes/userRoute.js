const express=require('express');
const router=express.Router();

const userController=require('../controllers/userController')


router.get('/',userController.userHome);

router.get('/user-login',userController.userLogin);

module.exports=router;