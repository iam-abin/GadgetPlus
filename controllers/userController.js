
const userSchema = require('../models/userModel');
const userHelper = require('../helpers/userHelper');
const productHelper=require('../helpers/productHelper')
const twilio = require('../api/twilio')
let loginStatus;

const landingPage = (req, res) => {
    try {
        res.render('user/index')
    } catch (error) {
        console.log(error);
    }
}

const userHome = async (req, res) => {
    try {
        res.status(200).render('user/index', {
            loginStatus
        })
    } catch (error) {
        console.log(error);
    }
}

const error = (req, res) => {
    res.render('/error')
}

const userSignup = async (req, res) => {
    res.render('user/user-signup', { user: true })
}


const userSignupPost = async (req, res) => {

    userHelper.doSignup(req.body).then((response) => {
        if (!response.userExist) {
            res.redirect('/user-login')
        } else {
            res.redirect('/')
        }
    })
}


const userLogin = async (req, res) => {
    res.render('user/login', { user: true })
}

const userLoginPost = async (req, res) => {

    await userHelper.doLogin(req.body).then((response) => {
        if (response.loggedIn) {
            req.session.user = response.user;
            loginStatus=req.session.user
            res.redirect('/')

        } else {
            res.redirect('/user-signup')
        }
    })
}

// -------------------------------------------------

// otp login page
const otpUser = (req, res) => {
    res.render('user/otp-form', {
        user_header: true,loginStatus,
    })
}

// otp sending in login process
const otpSending = async (req, res) => {
    const find = req.body;
    req.session.mobile = req.body.phone;
    console.log(req.body.phone);
    await userSchema.findOne({ phone: find.phone })
        .then(async (userData) => {
            if (userData) {
                console.log(userData + "find mobile no from db");
                req.session.tempUser = userData;
                await twilio.sentOtp(find.phone);
                res.render('user/otp-fill');
            } else {
                console.log("mobile not found");
                res.redirect('/user-signup')
            }
        })
        .catch((error) => {
            console.log(error + "ERROR");
            res.redirect('/user-signup')
        })
}

// otp verification process

const otpVerifying = async (req, res) => {
    const phone = req.session.mobile;
    const otp = req.body.otp;
    await twilio.verifyOtp(phone, otp)
        .then((status) => {
            console.log(status);
            if (status) {
                req.session.user = req.session.tempUser;
                loginStatus=req.session.user
                console.log("loggin successfulllllllllllllllllllll");
                res.redirect('/')
            } else {
                console.log("invalid otp");
                res.redirect('/user-signup')
            }
        }).catch((error) => {
            console.log(error + "error occured");
        })
}

// -------------------------------------------------

const userLogout = async (req, res) => {
    try {
        req.session.user = false;
        loginStatus=false;
        // req.session.loggedIn = false;
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}



const profile = async (req, res) => {
    res.render('user/profile')
}


const about = async (req, res) => {
    res.render('user/about',{loginStatus})
}

const laptop = async (req, res) => {
    res.render('user/laptop')
}

const Phone = async (req, res) => {
    productHelper.getAllProducts()
    .then((response)=>{
        res.render('user/phones',{phones:response})
    })
    
}

const wishlist = async (req, res) => {
    res.render('user/wishlist',{loginStatus})
}

const cart = async (req, res) => {
    res.render('user/cart',{loginStatus})
}

const checkout = async (req, res) => {
    res.render('user/checkout',{loginStatus})
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
    res.render('user/product',{loginStatus})
}

const orderSummary = async (req, res) => {
    res.render('user/mobile')
}

const contact = async (req, res) => {
    res.render('user/contact',{loginStatus})
}


module.exports = {
    landingPage,
    userHome,
    profile,
    userSignup,
    userSignupPost,
    userLogin,
    userLoginPost,
    otpUser,
    otpSending,
    otpVerifying,
    userLogout,
    about,
    laptop,
    Phone,
    wishlist,
    cart,
    error,
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