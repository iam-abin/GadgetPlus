
const userSchema = require('../models/userModel');
const couponSchema=require('../models/couponModel')
const userHelper = require('../helpers/userHelper');
const productHelper = require('../helpers/productHelper')
const categoryHelper = require('../helpers/categoryHelper')
const cartHelper = require('../helpers/cartHelper')
const twilio = require('../api/twilio');
const adminHelper = require('../helpers/adminHelper');
const addressHelper = require('../helpers/addressHelper');
const orderHepler = require('../helpers/orderHepler');
const couponHelper=require('../helpers/coupenHelper');

const razorpay=require('../api/razorpay')

var easyinvoice = require('easyinvoice');
const slugify = require('slugify');
const {dateFormat}=require('../controllers/adminController')
const wishListHelper = require('../helpers/wishListHelper');

let loginStatus;
let cartCount;






const landingPage = async (req, res) => {
    try {

        res.render('user/index')
    } catch (error) {
        console.log(error);
    }
}

const userHome = async (req, res) => {
    try {
        let user = req.session.user;
        cartCount = await cartHelper.getCartCount(user._id)
        res.status(200).render('user/index', { loginStatus, cartCount })
    } catch (error) {
        console.log(error);
    }
}

const error = (req, res) => {
    res.render('/error')
}

//---------------------------------------------------------
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
//---------------------------------------------------------


//---------------------------------------------------------

const userLogin = async (req, res) => {
    res.render('user/login', { user: true, loggedInError: req.session.loggedInError })
    // req.session.loggedInError = false;
}

const userLoginPost = async (req, res) => {

    await userHelper.doLogin(req.body).then((response) => {
        // console.log("----------------");
        // console.log(response);
        // console.log("----------------");

        if (response.loggedIn) {
            req.session.user = response.user;
            loginStatus = req.session.user
            // console.log( "sesionr",req.session.user._id);

            // res.redirect('/')
            return res.status(202).json({ error: false, message: response.logginMessage })

        } else {
            // req.session.loggedInError = response.loggedInError;
            return res.status(401).json({ error: false, message: response.logginMessage })

            // res.redirect('/user-login')
        }
    })
}

const forgotPassword = (req, res) => {
    try {
        res.render('user/otp-mobile-forgotpswd')
    } catch (error) {
        console.log(error);
    }
}

const otpSendingForgot = async (req, res) => {
    try {
        const find = req.body;

        req.session.mobile = find.phone;
        await userSchema.findOne({ phone: find.phone })
            .then(async (userData) => {
                if (userData) {
                    console.log(userData + "find mobile no from db");
                    await twilio.sentOtp(find.phone);
                    res.render('user/otp-fill-forgotpswd');
                } else {
                    console.log("mobile not found");
                    res.redirect('/user-signup')
                }
            })
            .catch((error) => {
                console.log(error + "ERROR");
                res.redirect('/user-signup')
            })

    } catch (error) {
        console.log(error);
    }
}

const otpVerifyingForgot = async (req, res) => {
    const phone = req.session.mobile;
    const otp = req.body.otp;
    await twilio.verifyOtp(phone, otp)
        .then((status) => {
            console.log(status);
            if (status) {
                console.log("verification successfulllllllllllllllllllll");
                res.render('user/resetPassword');
            } else {
                console.log("invalid otp");
                res.redirect('/user-signup')
            }
        }).catch((error) => {
            console.log(error + "error occured");
        })
}

const resetPassword = async (req, res) => {
    try {
        const phone = req.session.mobile;
        let newPassword = req.body.confirmPassword;
        let user = await userHelper.changePassword(newPassword, phone);
        console.log("resetted", user, "resetted");
        res.redirect('/user-login')

    } catch (error) {
        console.log(error);
    }

}

//---------------------------------------------------------


// otp login page
const otpUser = (req, res) => {
    res.render('user/otp-form', { loginStatus })
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
                loginStatus = req.session.user
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
        loginStatus = false;
        // req.session.loggedIn = false;
        res.redirect('/')
    } catch (error) {
        console.log(error);
    }
}



const profile = async (req, res) => {
    try {
        let userId = req.session.user._id;
        let addresses = await addressHelper.findAddresses(userId);

        console.log("addressese");
        console.log(addresses);
        console.log("addressese");


        console.log("////////", loginStatus);
        res.render('user/profile', { loginStatus, addresses,cartCount })
    } catch (error) {
        console.log(error);
    }
}


const about = async (req, res) => {
    res.render('user/about', { loginStatus, cartCount })
}

const viewProducts = async (req, res) => {
    try {
        const response = await productHelper.getAllProductsByCategory(req.params.id)
        for (let i = 0; i < response.length; i++) {

            if (req.session.user) {
                const isInCart = await cartHelper.isAProductInCart(req.session.user._id, response[i]._id);
                // console.log("bbbbbbbbbbbbb");
                // // console.log(response[i].product_name);
                // console.log(isInCart);
                // console.log("bbbbbbbbbbbbb");

                response[i].isInCart = isInCart;
            }
            response[i].product_price = Number(response[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
        }
        console.log("1111111111111111");
        console.log(response);
        console.log("1111111111111111");
        res.render('user/view-products', { product: response, loginStatus, cartCount })
    } catch (error) {
        console.log(error);
    }

}


const viewAProduct = async (req, res) => {
    try {
        let productId = req.params.id;
        let product = await productHelper.getAProduct(productId);
        product.product_price = Number(product.product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
        console.log("_________");
        console.log(product);
        console.log("_________");

        res.render('user/quick-view', { product });


    } catch (error) {
        console.log(error);
    }
}


const wishlist = async (req, res) => {
    try {
        let userId = req.sesion.user._id;
        let wishList = await wishListHelper.getAllWishListItems(userId)
        res.render('user/wishlist', { loginStatus })

    } catch (error) {
        console.log(error);
    }
}

const addToWishList = async (req, res) => {
    try {
        let productId = req.params.id;
        let user = req.session.user._id;

        wishListHelper.addItemToWishList(productId, user)
    } catch (error) {
        console.log(error);
    }
}

//---------------------------------------------------------

const cart = async (req, res) => {
    console.log("in cart");
    try {
        let user = req.session.user;
        let cartItems = await cartHelper.getAllCartItems(user._id)
        cartCount = await cartHelper.getCartCount(user._id)

        let totalandSubTotal = await cartHelper.totalSubtotal(user._id, cartItems)
        
        totalandSubTotal = currencyFormatWithFractional(totalandSubTotal)
        console.log("cartItems");
        console.log(cartItems);
        console.log("cartItems");
        res.render('user/cart', { loginStatus, cartItems, cartCount, totalAmount: totalandSubTotal })
    } catch (error) {
        console.log(error);
    }
}

// const addToCart = async (req, res) => {
//     try {
//         let productId = req.params.id;
//         let user = req.session.user;
//         let userId = user._id;
//         if (user) {
//             await cartHelper.addToUserCart(userId, productId)
//                 .then((response) => {
//                     res.status(202).json({ error: false, message: "item added to cart" })
//                 })
//         }else{
//             res.redirect('/user/user-login')
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).redirect('/404')
//     }
// }

const addToCart = async (req, res) => {
    try {
        let productId = req.params.id;
        console.log("productId", productId, "productId");
        let user = req.session.user;
        let response = await cartHelper.addToUserCart(user._id, productId);
        if (response) {
            console.log(response);
            cartCount = await cartHelper.getCartCount(user._id)
            res.status(202).json({ status: "success", message: "product added to cart" })
        }
    } catch (error) {
        console.log(error);
    }
}

const incDecQuantity = async (req, res) => {
    try {
        let obj = {}
        let user = req.session.user
        let productId = req.body.productId;
        let quantity = req.body.quantity;

        // console.log("user",user);
        // console.log("productId",productId);
        // console.log("quantity",quantity);

        response = await cartHelper.incDecProductQuantity(user._id, productId, quantity)

        obj.quantity=response.newQuantity;

        let cartItems = await cartHelper.getAllCartItems(user._id)
        obj.totalAmount = await cartHelper.totalSubtotal(user._id, cartItems)

        obj.totalAmount = obj.totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' })
        // console.log(obj);

        
        if(response.isOutOfStock){
            res.status(202).json({ OutOfStock:true, message: obj })
        }else{
            res.status(202).json({ OutOfStock:false, message: obj })
        }

    } catch (error) {
        console.log(error);
    }
}

const removeFromCart = (req, res) => {
    try {
        let cartId = req.body.cartId;
        let productId = req.params.id
        // console.log("hello");
        // console.log(productId);
        // console.log(cartId);
        // console.log("hello");

        cartHelper.removeAnItemFromCart(cartId, productId)
            .then((response) => {
                console.log("sucessfully deleted");
                res.status(202).json({ message: "sucessfully item removed" })
            })
    } catch (error) {
        console.log(error);
    }
}

//---------------------------------------------------------




const addAddress = async (req, res) => {
    try {

        console.log("-------------------------------");
        console.log(req.body);
        console.log("-------------------------------");
        addressHelper.addAddress(req.body)
            .then((response) => {
                // console.log(response);
                res.status(202).json({ message: "address added successfully" });

            })

    } catch (error) {
        console.log(error);
    }

    // res.render('user/mobile')
}


const editAddress = async (req, res) => {
    try {
        console.log("controller",req.params.id);
        let address=await addressHelper.getAnAddress(req.params.id);
        console.log("controller",address);
        res.json({address:address})
    } catch (error) {
        console.log(error);
    }
}

const editAddressPost=async(req,res)=>{
try {
    
    let addressUpdated=await addressHelper.editAnAddress(req.body);
    console.log(addressUpdated);
    res.json({message:"address updated"})

} catch (error) {
    console.log(error);
}    
   
}

const payment = async (req, res) => {
    res.render('user/mobile')
}

// ----------------------------------------------------------------------------------------------------
const checkout = async (req, res) => {     //to view details and price products that are going to order and manage address
    try {
        const user = req.session.user;

        let cartItems = await cartHelper.getAllCartItems(user._id);

        let totalAmount = await cartHelper.totalSubtotal(user._id, cartItems);
        totalAmount=totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' })
        const userAddress = await addressHelper.findAddresses(user._id);
        console.log("[[[[[[[[[[[[[[[");
        console.log(cartItems);
        for (let i = 0; i < cartItems.length; i++) {
            cartItems[i].product.product_price=cartItems[i].product.product_price.toLocaleString('en-in', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
            
        }
        // console.log(loginStatus);
        console.log("[[[[[[[[[[[[[[[");

        res.render('user/checkout', { loginStatus,cartCount, user, totalAmount: totalAmount,cartItems, address: userAddress })         //loginstatus contain user login info
    } catch (error) {
        console.log(error);
    }


}

const applyCoupon=async(req,res)=>{
    try {
        const user=req.session.user
        const {totalAmount,couponCode}=req.body;
        console.log("hhhhhhhhhhhhh",couponCode);
        console.log("hhhhhhhhhhhhh",totalAmount);
        const response=await couponHelper.applyCoupon(user._id,couponCode);

        console.log("responseddddddddddddddddd",response);
        res.status(202).json(response);


    } catch (error) {
        
    }
}


const placeOrder = async (req, res) => {
    try {
        let userId=req.body.userId

        let cartItems = await cartHelper.getAllCartItems(userId);
        let coupon=await couponSchema.find({user:userId})

        if(!cartItems.length){
           return res.json({error:true,message:"Please add items to cart before checkout"})
        }


        if(req.body.addressSelected==undefined ){
            return res.json({ error:true, message: "Please Choose Address" })
        }

        if(req.body.payment==undefined ){
            return res.json({ error:true, message: "Please Choose A Payment Method" })
        }

        
        const totalAmount = await cartHelper.totalAmount(userId); // instead find cart using user id and take total amound from that 
        console.log(totalAmount,"totalAmount");
        
        console.log(userId,"userId");
        console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");

        console.log(cartItems);
        console.log(req.body);
        console.log(userId);
        console.log(req.body.payment);
        console.log(req.body.addressSelected);
        console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");


        if (req.body.payment == 'COD') {
            const placeOrder = await orderHepler.orderPlacing(req.body, totalAmount,cartItems)
                .then(async (orderDetails) => {
                    await productHelper.decreaseStock(cartItems);
                    await cartHelper.clearCart(userId);
                    cartCount = await cartHelper.getCartCount(userId)
                    res.status(202).json({ success:'COD', message: "Purchase Done" })
                })
        }
        else if(req.body.payment=='razorpay'){
            await orderHepler.orderPlacing(req.body, totalAmount ,cartItems)
            .then(async (orderDetails)=>{
                // console.log("responseresponseresponseorderDetails",orderDetails);
                await razorpay.razorpayOrderCreate(orderDetails._id,orderDetails.totalAmount)
                .then((razorpayOrderDetails)=>{
                    res.json({success: 'razorpay',orderDetails,razorpayOrderDetails ,razorpaykeyId:process.env.RAZORPAY_KEY_ID})
                })

            })
        }

    } catch (error) {
        console.log(error);
    }
}

//razorpay payment verification
const verifyPayment = async(req,res)=>{
    const userId=req.session.user._id;
    console.log("verifyPaymentverifyPaymentverifyPayment",req.body);
    await razorpay.verifyPaymentSignature(req.body)
    .then(async (response)=>{
        console.log(response);
        if(response.signatureIsValid){
            console.log("order razorpay successfullllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
            await orderHepler.changeOrderStatus(req.body['orderDetails[_id]'],"confirmed");
            let cartItems = await cartHelper.getAllCartItems(userId);
            await productHelper.decreaseStock(cartItems);
            await cartHelper.clearCart(userId);


            res.status(200).json({status :true})
        }else{
            res.status(200).json({status :false})
        }
    })
}

const orderSuccess = (req, res) => {
    try {
        console.log("this is order success function");
        res.render('user/order-success', { loginStatus })
    } catch (error) {
        console.log(error);
    }
}

//to find all orders details of a user

const orders = async (req, res) => {
    try {
        const user=req.session.user;
        const userOrderDetails=await orderHepler.getAllOrderDetailsOfAUser(user._id);
        for (let i = 0; i < userOrderDetails.length; i++) {
            userOrderDetails[i].orderDate=dateFormat(userOrderDetails[i].orderDate);
            userOrderDetails[i].totalAmount=currencyFormat(userOrderDetails[i].totalAmount);
            
        }
        console.log("orders",userOrderDetails);

        res.render('user/orders-user',{userOrderDetails,loginStatus,cartCount})
    } catch (error) {
        
    }
}

const productOrderDetails = async (req, res) => {
    try {
      console.log(req.params);
      const orderId = req.params.id;
      let orderdetails = await orderHepler.getOrderedUserDetailsAndAddress(orderId); //got user details
      // let orderDetails= await orderHelper.getOrderDetails(orderId)
      let productDetails = await orderHepler.getOrderedProductsDetails(orderId); //got ordered products details

      console.log(">>>>>>>>>>>>>>>>>>>>>>>");
      console.log("orderdetails",orderdetails);
      console.log("productDetails",productDetails);
      console.log("loginStatus",loginStatus);
      console.log(">>>>>>>>>>>>>>>>>>>>>>>");
      
      res.render('user/order-details-user', { orderdetails, productDetails,loginStatus})
    } catch (error) {
      console.log(error);
    }
  }
// ----------------------------------------------------------------------------------------------------




const contact = async (req, res) => {
    res.render('user/contact', { loginStatus, cartCount })
}

const errorPage=(req,res)=>{
    res.render('error')
}

const notFound404 = async (req, res) => {
    res.render('user/404')
}

// convert a number to a indian currency format
function currencyFormat(amount){
    return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
}

function currencyFormatWithFractional(amount){
    return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR'})
}

module.exports = {
    landingPage,
    userHome,
    profile,
    userSignup,
    userSignupPost,
    userLogin,
    userLoginPost,
    forgotPassword,
    otpSendingForgot,
    otpVerifyingForgot,
    resetPassword,

    otpUser,
    otpSending,
    otpVerifying,
    userLogout,
    about,
    viewProducts,
    viewAProduct,

    wishlist,
    addToWishList,

    cart,
    addToCart,
    incDecQuantity,
    removeFromCart,
    error,
    checkout,
    // quickView,
    addAddress,
    editAddress,
    editAddressPost,
    payment,
    applyCoupon,
    placeOrder,
    verifyPayment,
    orderSuccess,

    orders,
    productOrderDetails,


    contact,
    errorPage,
    notFound404,
    // currencyFormat,
    // currencyFormatWithFractional,
}