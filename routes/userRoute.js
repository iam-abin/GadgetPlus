const express=require('express');
const router=express.Router();

const userController=require('../controllers/userController')


router.get('/',userController.userHome);

router.get('/user-login',userController.userLogin);

router.get('/about',userController.about);



module.exports=router;