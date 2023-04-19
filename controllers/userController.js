
const userSchema = require('../models/userModel');
const userHelper = require('../helpers/userHelper');
const twilio = require('../api/twilio')


const userHome = async (req, res) => {
    // console.log(req.session.user);
    // console.log("ajay12345");
    if (req.session.loggedIn) {
        res.render('user/index', {
            loginForm: false,
            loggedIn: req.session.loggedIn,
            user: req.session.user,
        })
    } else {
        res.render('user/index')
    }

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
            req.session.loggedIn = true;
            req.session.user = response.user;
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
        user_header: true,
    })
}

// otp sending in login process
const otpSending = async (req, res) => {
    const find = req.body;
    req.session.mobile = req.body.phone;
    console.log(req.body.phone);
    await userSchema.findOne({phone:find.phone})
        .then(async (userData) => {
            if (userData) {
                console.log(userData + "find mobile no from db");
                req.session.tempUser = userData;
                await twilio.sentOtp(find.phone);
                res.render('user/otp-fill');
            }else{
                console.log("mobile not found");
                res.redirect('/user-signup')
            }
        })
        .catch((error) => {
            console.log(error+"ERROR");
            res.redirect('/user-signup')
        })
}

// otp verification process

const otpVerifying = async (req, res) => {
    const phone = req.session.mobile;
    const otp = req.body.otp;
    await twilio.verifyOtp(phone,otp)
    .then((status)=>{
        console.log(status);
        if(status){
            req.session.user=req.session.tempUser;
            req.session.loggedIn=true;
            console.log("loggin successfulllllllllllllllllllll");
            res.redirect('/')
        }else{
            console.log("invalid otp");
            res.redirect('/user-signup')
        }
    }).catch((error)=>{
        console.log(error+"error occured");
    })
}

// -------------------------------------------------

const userLogout = async (req, res) => {
    try {
        req.session.loggedIn=false;
        res.redirect('/')
    } catch (error) {
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

const mobileNum = async (req, res) => {
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
    otpSending,
    otpVerifying,
    userLogout,
    about,
    laptop,
    mobileNum,
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