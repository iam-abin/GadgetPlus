const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const userHelper=require('../helpers/userHelper')


const userHome = async (req, res) => {
    // console.log(req.session.user);
    // console.log("ajay12345");
    if(req.session.loggedIn){
        res.render('user/index', {
            loginForm: false,
            loggedIn: req.session.loggedIn,
            user: req.session.user,
        })
    }else{
        res.render('user/index')
    }
   
}


const userSignup = async (req, res) => {
    res.render('user/user-signup', { others: true })
}

const userSignupPost = async (req, res) => {

    userHelper.doSignup(req.body).then((response)=>{
        if(!response.userExist){
            res.redirect('/user-login')
        }else{
            res.redirect('/')
        }
    })
}

const userLogin = async (req, res) => {
    res.render('user/login2', { others: true })
}

const userLoginPost = async (req, res) => {

    await userHelper.doLogin(req.body).then((response)=>{
        if(response.loggedIn){
            req.session.loggedIn=true;
            req.session.user=response.user;
            res.redirect('/')

        }else{
            res.redirect('/user-signup')
        }
    })
}

const otpUser = (req, res) => {
    res.render('user/otp2')
}


const userLogout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/')
    }catch(error){
        console.log(error);
    }
}


const profile = async (req, res) => {
    res.render('user/profile')
}


const about = async (req, res) => {
    res.render('user/about')
}

const laptop = async (req, res) => {
    res.render('user/laptop')
}

const mobile = async (req, res) => {
    res.render('user/mobile')
}

const wishlist = async (req, res) => {
    res.render('user/wishlist')
}

const cart = async (req, res) => {
    res.render('user/cart')
}

const checkout = async (req, res) => {
    res.render('user/checkout')
}

// const quickView = async (req, res) => {
//     res.render('user/product')
// }

const addAddress = async (req, res) => {
    res.render('user/mobile')
}

const editAddress = async (req, res) => {
    res.render('user/mobile')
}

const payment = async (req, res) => {
    res.render('user/mobile')
}

const orderDetails = async (req, res) => {
    res.render('user/mobile')
}

const product = async (req, res) => {
    res.render('user/product')
}

const orderSummary = async (req, res) => {
    res.render('user/mobile')
}

const contact = async (req, res) => {
    res.render('user/contact')
}


module.exports = {
    userHome,
    profile,
    userSignup,
    userSignupPost,
    userLogin,
    userLoginPost,
    otpUser,
    userLogout,
    about,
    laptop,
    mobile,
    wishlist,
    cart,
    checkout,
    // quickView,
    addAddress,
    editAddress,
    payment,
    orderDetails,
    orderSummary,
    contact,
    product

}