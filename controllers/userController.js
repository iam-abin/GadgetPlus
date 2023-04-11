const userModel=require('../models/userModel');

// const userHome=async (req,res)=>{
//     res.render('user/login',{loginForm:true})
// }
const userHome=async (req,res)=>{
    res.render('user/contactUs',{loginForm:false})
}

const userLogin=async (req,res)=>{
    res.render('user/login')
}

    
const about=async (req,res)=>{
    res.render('user/about')
}

module.exports={
    userHome,
    userLogin,
    about
}