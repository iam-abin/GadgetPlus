
const User = require('../models/userModel');
const bcrypt = require('bcrypt')


const userHome = async (req, res) => {
    console.log(req.session.user);
    console.log("ajay12345");
    res.render('user/index-8', {loginForm: false ,
        loggedIn:req.session.loggedIn,user:req.session.user,
    })
}


const userSignup = async (req, res) => {
    res.render('user/user-signup',{others:true})
}

const userSignupPost = async (req, res) => {
    try {
        
        const data = req.body;
        console.log(data);
        const isUserExist = await User.findOne({ email: data.email });
        console.log(isUserExist);
        if (isUserExist) {
            console.log(`User ${data.email} already exist`);
            res.redirect('/user-signup')
        } else {
            const password = await bcrypt.hash(req.body.password, 10);
            User.create({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: password
            }).then((data) => {
                console.log(data);
            }).catch((err) => {
                console.log(err);
            })

            res.redirect('/user-login')
        }
    } catch (err) {
        console.log(err);

        res.redirect('/')
        console.log("catch error");style="font-size: 25px; color: black; margin-left: 21px; margin-right: 15px; margin-bottom: 10px;"
    }

}

const userLogin = async (req, res) => {
    res.render('user/login',{others:true})
}

const userLoginPost = async (req, res) => {

    try {
        let email = req.body.email;
        let userData = await User.findOne({ email: email })
        console.log(userData);
        console.log(req.body.password);
        if (userData) {
            bcrypt.compare(req.body.password, userData.password).then((result) => {
                if (result) {
                    
                    req.session.loggedIn = true;
                    req.session.user=userData;
                    res.redirect('/')
                    console.log("Login success");
                } else {
                    res.render('user/404')
                    console.log("password is not matching");
                }
            })
        } else {
            res.render('user/404')
            console.log("User not Found");
        }
    } catch (err) {
        console.log(err);
        console.log("error occured in login");
    }
}

const otpUser=(req,res)=>{
    res.render('user/otp2')
}

const userLogout=async (req, res) => {
    req.session.destroy()
    res.redirect('/')
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
    res.render('user/mobile')
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
    addAddress,
    editAddress,
    payment,
    orderDetails,
    orderSummary,
    contact,
    product

}