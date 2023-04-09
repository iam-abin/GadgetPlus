const userModel=require('../models/userModel');

const userHome=async (req,res)=>{
    res.send("user Home Page")
}

const userLogin=async (req,res)=>{
    res.send("user Login Page")
}

module.exports={
    userHome,
    userLogin
}