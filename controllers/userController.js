const userSchema = require('../models/userModel');
const couponSchema = require('../models/couponModel');
const productSchema = require('../models/productModel');

const userHelper = require('../helpers/userHelper');
const productHelper = require('../helpers/productHelper')
const cartHelper = require('../helpers/cartHelper')
const addressHelper = require('../helpers/addressHelper');
const orderHepler = require('../helpers/orderHepler');
const couponHelper = require('../helpers/coupenHelper');
const wishListHelper = require('../helpers/wishListHelper');
const walletHelper = require('../helpers/walletHelper');

const { dateFormat } = require('../controllers/adminController')

const twilio = require('../api/twilio');
const razorpay = require('../api/razorpay')
const paypal = require('../api/paypal');

var easyinvoice = require('easyinvoice');

let cartCount;
let wishListCount;


const landingPage = async (req, res, next) => {
    try {
        let latestProducts = await productHelper.getRecentProducts();
        let featuredProducts = await productHelper.getFeaturedProducts();
        res.render('user/index', { loginStatus: req.session.user, latestProducts, featuredProducts })
    } catch (error) {
        return next(error)
    }
}

const userHome = async (req, res, next) => {
    try {
        let userId = req.session.user._id;
        cartCount = await cartHelper.getCartCount(userId)
        wishListCount = await wishListHelper.getWishListCount(userId)
        let latestProducts = await productHelper.getRecentProducts();
        let featuredProducts = await productHelper.getFeaturedProducts();

        for (let i = 0; i < latestProducts.length; i++) {
            const isInWishList = await wishListHelper.isProductInWishList(userId, latestProducts[i]._id);
            const isInCart = await cartHelper.isAProductInCart(userId, latestProducts[i]._id);

            latestProducts[i].isInWishList = isInWishList;
            latestProducts[i].isInCart = isInCart;

            latestProducts[i].product_price = currencyFormat(latestProducts[i].product_price)
        }

        for (let i = 0; i < featuredProducts.length; i++) {
            const isInWishList = await wishListHelper.isProductInWishList(userId, featuredProducts[i]._id);
            const isInCart = await cartHelper.isAProductInCart(userId, featuredProducts[i]._id);

            featuredProducts[i].isInWishList = isInWishList;
            featuredProducts[i].isInCart = isInCart;

            featuredProducts[i].product_price = currencyFormat(featuredProducts[i].product_price)
        }

        res.status(200).render('user/index', { loginStatus: req.session.user, cartCount, wishListCount, latestProducts, featuredProducts })
    } catch (error) {
        return next(error)
    }
}

const error = (req, res) => {
    res.render('/error')
}

const userSignup = async (req, res) => {
    res.render('user/signup', { headerFooter: true })
}

const userSignupPost = async (req, res, next) => {
    userHelper.doSignup(req.body)
        .then((response) => {
            if (!response.userExist) {
                res.redirect('/user-login')
            } else {
                res.redirect('/')
            }
        })
        .catch((error) => {
            return next(error);
        })
}

const userLogin = async (req, res) => {
    res.render('user/login', { headerFooter: true, loggedInError: req.session.loggedInError })
}

const userLoginPost = async (req, res, next) => {
    await userHelper.doLogin(req.body)
        .then((response) => {
            if (response.loggedIn) {
                req.session.user = response.user;
                return res.status(202).json({ error: false, message: response.logginMessage })
            } else {
                return res.status(401).json({ error: false, message: response.logginMessage })
            }
        })
        .catch((error) => {
            return next(error)
        })
}

const forgotPassword = (req, res) => {
    res.render('user/otp-mobile-forgotpswd')
}

const otpSendingForgot = async (req, res, next) => {
    try {
        const find = req.body;

        req.session.mobile = find.phone;
        await userSchema.findOne({ phone: find.phone })
            .then(async (userData) => {
                if (userData) {
                    await twilio.sentOtp(find.phone);
                    res.render('user/otp-fill-forgotpswd');
                } else {
                    res.redirect('/user-signup')
                }
            })
            .catch((error) => {
                res.redirect('/user-signup')
            })
    } catch (error) {
        return next(error);
    }
}

const otpVerifyingForgot = async (req, res, next) => {
    const phone = req.session.mobile;
    const otp = req.body.otp;
    await twilio.verifyOtp(phone, otp)
        .then((status) => {
            if (status) {
                res.render('user/resetPassword');
            } else {
                res.redirect('/user-signup')
            }
        }).catch((error) => {
            return next(error);
        })
}

const resetPassword = async (req, res, next) => {
    try {
        const phone = req.session.mobile;
        let newPassword = req.body.confirmPassword;
        await userHelper.changePassword(newPassword, phone);
        res.redirect('/user-login')
    } catch (error) {
        return next(error);
    }

}


// otp login page
const otpUser = (req, res) => {
    res.render('user/otp-form', { loginStatus: req.session.user })
}

// otp sending in login process
const otpSending = async (req, res) => {
    const find = req.body;
    req.session.mobile = req.body.phone;
    await userSchema.findOne({ phone: find.phone })
        .then(async (userData) => {
            if (userData) {
                req.session.tempUser = userData;
                await twilio.sentOtp(find.phone);
                res.render('user/otp-fill');
            } else {
                res.redirect('/user-signup')
            }
        })
        .catch((error) => {
            res.redirect('/user-signup')
        })
}

// otp verification process
const otpVerifying = async (req, res, next) => {
    const phone = req.session.mobile;
    const otp = req.body.otp;
    await twilio.verifyOtp(phone, otp)
        .then((status) => {
            if (status) {
                req.session.user = req.session.tempUser;
                res.redirect('/')
            } else {
                res.redirect('/user-signup')
            }
        }).catch((error) => {
            return next(error);
        })
}

const getWallet = async (req, res, next) => {
    try {
        let userId = req.session.user._id
        let walletBalance = await walletHelper.walletBalance(userId);
        walletDetails = currencyFormat(walletBalance)
        res.json({ walletDetails });
    } catch (error) {
        return next(error);
    }
}

const userLogout = async (req, res, next) => {
    try {
        req.session.user = null;
        res.redirect('/')
    } catch (error) {
        return next(error);
    }
}

const profile = async (req, res, next) => {
    try {
        let userId = req.session.user._id;
        let addresses = await addressHelper.findAddresses(userId);
        res.render('user/profile', { loginStatus: req.session.user, addresses, cartCount, wishListCount })
    } catch (error) {
        return next(error);
    }
}

const viewProducts = async (req, res, next) => {
    try {
        let products;
        // let minAmount= await productHelper.getMinimumPrice();
        // let maxAmount= await productHelper.getMaximumPrice();
        // const page = req.params.page;
        // const perPage = 2;
        if (req.session.user) {

            let userId = req.session.user._id;
            cartCount = await cartHelper.getCartCount(userId)
            wishListCount = await wishListHelper.getWishListCount(userId)
        }

        if (!req.query.filterData) {
            products = await productHelper.getAllProductsWithLookup()
            for (let i = 0; i < products.length; i++) {
                if (req.session.user) {
                    let userId = req.session.user._id;
                    const isInCart = await cartHelper.isAProductInCart(userId, products[i]._id);
                    const isInWishList = await wishListHelper.isProductInWishList(userId, products[i]._id);

                    products[i].isInCart = isInCart;
                    products[i].isInWishList = isInWishList;

                }
                products[i].product_price = Number(products[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
            }

            res.render('user/view-products', { product: products, loginStatus: req.session.user, cartCount, wishListCount })
        } else {
            let filterData = JSON.parse(req.query.filterData);
            products = await productHelper.filterProduct(filterData)
            for (let i = 0; i < products.length; i++) {
                if (req.session.user) {
                    let userId = req.session.user._id;
                    const isInCart = await cartHelper.isAProductInCart(userId, products[i]._id);
                    const isInWishList = await wishListHelper.isProductInWishList(userId, products[i]._id);

                    products[i].isInCart = isInCart;
                    products[i].isInWishList = isInWishList;

                }
                products[i].product_price = Number(products[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
            }
            res.json({ product: products, loginStatus: req.session.user, cartCount, wishListCount })
        }
    } catch (error) {
        return next(error);
    }
}

const viewAProduct = async (req, res, next) => {
    try {
        let productSlug = req.params.slug;
        let product = await productHelper.getAProduct(productSlug);
        if (req.session.user) {
            const isInCart = await cartHelper.isAProductInCart(req.session.user._id, product._id);
            product.isInCart = isInCart;
        }
        product.product_price = currencyFormat(product.product_price)
        res.render('user/quick-view', { product, cartCount, loginStatus: req.session.user, wishListCount });
    } catch (error) {
        return next(error);
    }
}

const wishlist = async (req, res, next) => {
    try {
        let userId = req.session.user._id;
        let wishList = await wishListHelper.getAllWishListItems(userId);
        res.render('user/wishlist', { loginStatus: req.session.user, wishList, cartCount, wishListCount })
    } catch (error) {
        return next(error);
    }
}

const addToWishList = async (req, res, next) => {
    try {
        let productId = req.body.productId;
        let user = req.session.user._id;
        wishListHelper.addItemToWishList(productId, user)
        res.json({ message: `item added to wishList ${productId}` })
    } catch (error) {
        return next(error);
    }
}

const removeFromWishList = async (req, res, next) => {
    try {
        let userId = req.session.user._id;
        let productId = req.body.productId;
        await wishListHelper.removeAnItemFromWishList(userId, productId);
        wishListCount = await wishListHelper.getWishListCount(userId)
        res.status(200).json({ message: "product removed from wishList", wishListCount })
    } catch (error) {
        return next(error);
    }
}

const cart = async (req, res, next) => {
    try {
        let user = req.session.user;
        let cartItems = await cartHelper.getAllCartItems(user._id)
        cartCount = await cartHelper.getCartCount(user._id)
        wishListCount = await wishListHelper.getWishListCount(user._id)
        let totalandSubTotal = await cartHelper.totalSubtotal(user._id, cartItems)

        totalandSubTotal = currencyFormatWithFractional(totalandSubTotal)
        res.render('user/cart', { loginStatus: req.session.user, cartItems, cartCount, totalAmount: totalandSubTotal, wishListCount })
    } catch (error) {
        return next(error);
    }
}

const addToCart = async (req, res, next) => {
    try {
        let productId = req.params.id;
        let user = req.session.user;
        let response = await cartHelper.addToUserCart(user._id, productId);
        if (response) {
            cartCount = await cartHelper.getCartCount(user._id)
            wishListCount = await wishListHelper.getWishListCount(user._id)
            res.status(202).json({ status: "success", message: "product added to cart" })
        }
    } catch (error) {
        return next(error);
    }
}

const incDecQuantity = async (req, res, next) => {
    try {
        let obj = {}
        let user = req.session.user
        let productId = req.body.productId;
        let quantity = req.body.quantity;

        response = await cartHelper.incDecProductQuantity(user._id, productId, quantity);

        obj.quantity = response.newQuantity;

        let cartItems = await cartHelper.getAllCartItems(user._id)
        obj.totalAmount = await cartHelper.totalSubtotal(user._id, cartItems)

        obj.totalAmount = obj.totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' })
        if (response.isOutOfStock) {
            res.status(202).json({ OutOfStock: true, message: obj })
        } else {
            res.status(202).json({ OutOfStock: false, message: obj })
        }
    } catch (error) {
        return next(error);
    }
}

const removeFromCart = (req, res, next) => {
    try {
        let userId = req.session.user._id;
        let cartId = req.body.cartId;
        let productId = req.params.id;

        cartHelper.removeAnItemFromCart(cartId, productId)
            .then(async (response) => {
                let cartItems = await cartHelper.getAllCartItems(userId)
                let totalAmount = await cartHelper.totalSubtotal(userId, cartItems);
                totalAmount = totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' })

                let cartCount = await cartHelper.getCartCount(userId)
                wishListCount = await wishListHelper.getWishListCount(userId)
                res.status(202).json({ message: "sucessfully item removed", totalAmount, cartCount, wishListCount })
            })
    } catch (error) {
        return next(error);
    }
}


const addAddress = async (req, res, next) => {
    try {
        addressHelper.addAddress(req.body)
            .then((response) => {
                res.status(202).json({ message: "address added successfully" });

            })
    } catch (error) {
        return next(error);
    }
}

const editAddress = async (req, res, next) => {
    try {
        let address = await addressHelper.getAnAddress(req.params.id);
        res.json({ address: address })
    } catch (error) {
        return next(error);
    }
}

const editAddressPost = async (req, res, next) => {
    try {
        await addressHelper.editAnAddress(req.body);
        res.json({ message: "address updated" })
    } catch (error) {
        return next(error);
    }
}

const deleteAddressPost = async (req, res, next) => {
    try {
        await addressHelper.deleteAnAddress(req.params.id);
        res.json({ message: "address Deleted Successfully.." })
    } catch (error) {
        return next(error)
    }
}

const checkout = async (req, res, next) => {     //to view details and price products that are going to order and manage address
    try {
        const user = req.session.user;

        let cartItems = await cartHelper.getAllCartItems(user._id);
        let walletBalance = await walletHelper.walletBalance(user._id)
        walletBalance = currencyFormat(walletBalance);

        let totalAmount = await cartHelper.totalSubtotal(user._id, cartItems);
        totalAmount = totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' })
        const userAddress = await addressHelper.findAddresses(user._id);

        for (let i = 0; i < cartItems.length; i++) {
            cartItems[i].product.product_price = cartItems[i].product.product_price.toLocaleString('en-in', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

        }

        res.render('user/checkout', { loginStatus: req.session.user, cartCount, wishListCount, walletBalance, user, totalAmount: totalAmount, cartItems, address: userAddress })         //loginstatus contain user login info
    } catch (error) {
        return next(error);
    }
}

const applyCoupon = async (req, res, next) => {
    try {
        const user = req.session.user
        const { totalAmount, couponCode } = req.body;
        const response = await couponHelper.applyCoupon(user._id, couponCode);

        res.status(202).json(response);
    } catch (error) {
        return next(error)
    }
}

const placeOrder = async (req, res, next) => {
    try {
        let userId = req.body.userId;
        let cartItems = await cartHelper.getAllCartItems(userId);
        let coupon = await couponSchema.find({ user: userId })

        if (!cartItems.length) {
            return res.json({ error: true, message: "Please add items to cart before checkout" })
        }

        if (req.body.addressSelected == undefined) {
            return res.json({ error: true, message: "Please Choose Address" })
        }

        if (req.body.payment == undefined) {
            return res.json({ error: true, message: "Please Choose A Payment Method" })
        }

        const totalAmount = await cartHelper.totalAmount(userId); // instead find cart using user id and take total amound from that 

        if (req.body.payment == 'COD') {
            await orderHepler.orderPlacing(req.body, totalAmount, cartItems)
                .then(async (orderDetails) => {
                    await productHelper.decreaseStock(cartItems);
                    await cartHelper.clearCart(userId);
                    res.status(202).json({ paymentMethod: 'COD', message: "Purchase Done" })
                })
        }
        else if (req.body.payment == 'razorpay') {
            await orderHepler.orderPlacing(req.body, totalAmount, cartItems)
                .then(async (orderDetails) => {
                    await razorpay.razorpayOrderCreate(orderDetails._id, orderDetails.totalAmount)
                        .then(async (razorpayOrderDetails) => {
                            await orderHepler.changeOrderStatus(orderDetails._id, 'confirmed');
                            await productHelper.decreaseStock(cartItems);
                            await cartHelper.clearCart(userId);
                            res.json({ paymentMethod: 'razorpay', orderDetails, razorpayOrderDetails, razorpaykeyId: process.env.RAZORPAY_KEY_ID })
                        })
                })
        }
        else if (req.body.payment == 'paypal') {
            await orderHepler.orderPlacing(req.body, totalAmount, cartItems)
                .then(async (orderDetails) => {
                    await paypal.paypayPay()
                        .then(async (paypalOrderDetails) => {
                            await orderHepler.changeOrderStatus(orderDetails._id, 'confirmed');
                            await productHelper.decreaseStock(cartItems);
                            await cartHelper.clearCart(userId);
                            res.json({ paymentMethod: 'paypal', orderDetails, paypalOrderDetails })
                        })
                })
        }
        else if (req.body.payment == 'wallet') {
            let isPaymentDone = await walletHelper.payUsingWallet(userId, totalAmount);
            if (isPaymentDone) {
                await orderHepler.orderPlacing(req.body, totalAmount, cartItems)
                    .then(async (orderDetails) => {
                        await orderHepler.changeOrderStatus(orderDetails._id, 'confirmed');
                        await productHelper.decreaseStock(cartItems);
                        await cartHelper.clearCart(userId);
                        res.status(202).json({ paymentMethod: 'wallet', error: false, message: "Purchase Done" })
                    })
            } else {
                res.status(200).json({ paymentMethod: 'wallet', error: true, message: "Insufficient Balance in wallet" })
            }
        }
    } catch (error) {
        return next(error)
    }
}

//razorpay payment verification
const verifyPayment = async (req, res, next) => {
    const userId = req.session.user._id;
    await razorpay.verifyPaymentSignature(req.body)
        .then(async (response) => {
            if (response.signatureIsValid) {
                await orderHepler.changeOrderStatus(req.body['orderDetails[_id]'], "confirmed");
                let cartItems = await cartHelper.getAllCartItems(userId);
                await productHelper.decreaseStock(cartItems);
                await cartHelper.clearCart(userId);

                res.status(200).json({ status: true })
            } else {
                res.status(200).json({ status: false })
            }
        })
        .catch((error) => {
            return next(error)
        })
}

const orderSuccess = (req, res, next) => {
    try {
        res.render('user/order-success', { loginStatus: req.session.user })
    } catch (error) {
        return next(error);
    }
}

//to find all orders details of a user
const orders = async (req, res, next) => {
    try {
        const user = req.session.user;
        const userOrderDetails = await orderHepler.getAllOrderDetailsOfAUser(user._id);
        for (let i = 0; i < userOrderDetails.length; i++) {
            userOrderDetails[i].orderDate = dateFormat(userOrderDetails[i].orderDate);
            userOrderDetails[i].totalAmount = currencyFormat(userOrderDetails[i].totalAmount);
        }
        res.render('user/orders-user', { userOrderDetails, loginStatus: req.session.user, cartCount, wishListCount })
    } catch (error) {
        return next(error);
    }
}

const productOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        let orderDetails = await orderHepler.getOrderedUserDetailsAndAddress(orderId); //got user details
        let productDetails = await orderHepler.getOrderedProductsDetails(orderId); //got ordered products details
        res.render('user/order-details-user', { orderDetails, cartCount, wishListCount, productDetails, loginStatus: req.session.user });
    } catch (error) {
        return next(error);
    }
}

const cancelOrder = async (req, res, next) => {
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
        await orderHepler.cancelOrder(userId, orderId);
        res.status(200).json({ isCancelled: true, message: "order canceled successfully" });
    } catch (error) {
        return next(error);
    }
}

const returnOrder = async (req, res, next) => {
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
        await orderHepler.returnOrder(userId, orderId);
        res.status(200).json({ isreturned: 'return pending', message: "order returned Process Started" });
    } catch (error) {
        return next(error);
    }
}

const contact = async (req, res) => {
    res.render('user/contact', { loginStatus: req.session.user, cartCount, wishListCount });
}

const searchProduct = async (req, res, next) => {
    let payload = req.body.payload.trim();
    try {
        let searchResult = await productSchema.find({ product_name: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
        searchResult = searchResult.slice(0, 5);
        res.send({ searchResult });
    } catch (error) {
        next(error);
    }
}

const errorPage = (req, res) => {
    res.render('error')
}

// convert a number to a indian currency format
function currencyFormat(amount) {
    return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 });
}

function currencyFormatWithFractional(amount) {
    return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR' });
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
    getWallet,
    userLogout,
    viewProducts,
    viewAProduct,
    wishlist,
    addToWishList,
    removeFromWishList,
    cart,
    addToCart,
    incDecQuantity,
    removeFromCart,
    error,
    checkout,
    addAddress,
    editAddress,
    editAddressPost,
    deleteAddressPost,
    applyCoupon,
    placeOrder,
    verifyPayment,
    orderSuccess,
    orders,
    productOrderDetails,
    cancelOrder,
    returnOrder,
    contact,
    searchProduct,
    errorPage,
}