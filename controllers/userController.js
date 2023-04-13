const userModel = require('../models/userModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt')

// const userHome=async (req,res)=>{
//     res.render('user/login',{loginForm:true})
// }

const userHome = async (req, res) => {
    res.render('user/index-8', { loginForm: false })
}

const userSignup = async (req, res) => {
    res.render('user/user-signup')
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
        console.log("catch error");
    }

}

const userLogin = async (req, res) => {
    res.render('user/login')
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
                    res.redirect('/')
                    console.log("Login success");
                } else {
                    res.render('user/404')
                    console.log("password is not matching");

                }
            })
        } else {
            res.render('user/404')
            console.log("password is not matching");
        }
    } catch (err) {
        console.log(err);
        console.log("error occurd in login");
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