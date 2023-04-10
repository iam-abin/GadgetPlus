const userModel=require('../models/userModel');

const userHome=async (req,res)=>{
    res.render('user/about')
}

const userLogin=async (req,res)=>{
    res.send("user Login Page")
}

    
const about=async (req,res)=>{
    res.render('user/about')
}

module.exports={
    userHome,
    userLogin,
    about
}