
const userSchema = require('../models/userModel');
const couponSchema = require('../models/couponModel');
const productSchema = require('../models/productModel');
const userHelper = require('../helpers/userHelper');
const productHelper = require('../helpers/productHelper')
const categoryHelper = require('../helpers/categoryHelper')
const cartHelper = require('../helpers/cartHelper')
const twilio = require('../api/twilio');
const adminHelper = require('../helpers/adminHelper');
const addressHelper = require('../helpers/addressHelper');
const orderHepler = require('../helpers/orderHepler');
const couponHelper = require('../helpers/coupenHelper');

const razorpay = require('../api/razorpay')

var easyinvoice = require('easyinvoice');
// const slugify = require('slugify');
const { dateFormat } = require('../controllers/adminController')
const wishListHelper = require('../helpers/wishListHelper');
const walletHelper = require('../helpers/walletHelper');

let loginStatus;
let cartCount;
let wishListCount;




const landingPage = async (req, res) => {
    try {
        let latestProducts = await productHelper.getRecentProducts()
        let featuredProducts = await productHelper.getFeaturedProducts()
        res.render('user/index', { latestProducts, featuredProducts })
    } catch (error) {
        console.log(error);
    }
}

const userHome = async (req, res) => {
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

        console.log(featuredProducts, "featuredProducts");
        console.log(latestProducts, "latestProducts");
        res.status(200).render('user/index', { loginStatus, cartCount, wishListCount, latestProducts, featuredProducts })
    } catch (error) {
        console.log(error);
        res.redirect('/404')
    }
}

const error = (req, res) => {
    res.render('/error')
}

//---------------------------------------------------------
const userSignup = async (req, res) => {
    res.render('user/user-signup', { headerFooter: true })
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
    res.render('user/login', { headerFooter: true, loggedInError: req.session.loggedInError })
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

const getWallet = async (req, res) => {
    try {
        let userId = req.session.user._id
        let walletBalance = await walletHelper.walletBalance(userId);
        // let walletBalance = await walletHelper.walletBalance(user._id)
        walletDetails = currencyFormat(walletBalance)
        res.json({ walletDetails });
    } catch (error) {
        res.redirect('/error')
    }

}

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
        res.render('user/profile', { loginStatus, addresses, cartCount, wishListCount })
    } catch (error) {
        console.log(error);
    }
}


const about = async (req, res) => {
    res.render('user/about', { loginStatus, cartCount, wishListCount })
}

// const viewProducts = async (req, res) => {
//     try {

//         const response = await productHelper.getAllProductsByCategory(req.params.id)
//         for (let i = 0; i < response.length; i++) {
//             if (req.session.user) {
//                 let userId = req.session.user._id;
//                 const isInCart = await cartHelper.isAProductInCart(userId, response[i]._id);
//                 // console.log("bbbbbbbbbbbbb");
//                 // // console.log(response[i].product_name);
//                 // console.log(isInCart);
//                 // console.log("bbbbbbbbbbbbb");

//                 response[i].isInCart = isInCart;
//             }
//             response[i].product_price = Number(response[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
//         }
//         console.log("1111111111111111");
//         console.log(response);
//         console.log("1111111111111111");
//         if(req.session.user){
//             let userId = req.session.user._id;

//             cartCount = await cartHelper.getCartCount(userId)
//             wishListCount = await wishListHelper.getWishListCount(userId)
//         }

//         res.render('user/view-products', { product: response, loginStatus, cartCount, wishListCount })
//     } catch (error) {
//         console.log(error);
//     }

// }

const viewProducts = async (req, res) => {  //use array destructuring 
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

        console.log(req.query.filterData, "hi");

        if (!req.query.filterData) {
            console.log("if not req.params");

            products = await productHelper.getAllProductsWithLookup()
            for (let i = 0; i < products.length; i++) {
                if (req.session.user) {
                    let userId = req.session.user._id;
                    const isInCart = await cartHelper.isAProductInCart(userId, products[i]._id);
                    const isInWishList = await wishListHelper.isProductInWishList(userId, products[i]._id);

                    // console.log("bbbbbbbbbbbbb");
                    // // console.log(products[i].product_name);
                    // console.log(isInCart);
                    // console.log("bbbbbbbbbbbbb");

                    products[i].isInCart = isInCart;
                    products[i].isInWishList = isInWishList;

                }
                products[i].product_price = Number(products[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
            }

            console.log(products, "productssssssssssss");
            res.render('user/view-products', { product: products, loginStatus, cartCount, wishListCount })


        } else {
            
            console.log("if req.params");

            let filterData = JSON.parse(req.query.filterData)
            console.log("kkkkkkk");
            console.log(filterData);
            console.log(typeof filterData.min);
            console.log(filterData.selectedCategories[0]);
            console.log("kkkkkkk");
            products = await productHelper.filterProduct(filterData)
            for (let i = 0; i < products.length; i++) {
                if (req.session.user) {
                    let userId = req.session.user._id;
                    const isInCart = await cartHelper.isAProductInCart(userId, products[i]._id);
                    const isInWishList = await wishListHelper.isProductInWishList(userId, products[i]._id);

                    // console.log("bbbbbbbbbbbbb");
                    // // console.log(products[i].product_name);
                    // console.log(isInCart);
                    // console.log("bbbbbbbbbbbbb");

                    products[i].isInCart = isInCart;
                    products[i].isInWishList = isInWishList;

                }
                products[i].product_price = Number(products[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
            }
            res.json({ product: products, loginStatus, cartCount, wishListCount })
        }


        // console.log("1111111111111111");
        // console.log(products);
        // console.log("1111111111111111");
        // if(req.session.user){
        //     let userId = req.session.user._id;

        //     cartCount = await cartHelper.getCartCount(userId)
        //     wishListCount = await wishListHelper.getWishListCount(userId)
        // }

    } catch (error) {
        console.log(error);
    }

}



const viewAProduct = async (req, res) => {
    try {
        let productSlug = req.params.slug;
        console.log(req.params, "paramsssssssssssssss");
        let product = await productHelper.getAProduct(productSlug);
        // console.log("bbbbbbbbbbbbb");
        // console.log(product);
        // console.log("bbbbbbbbbbbbb");
        if (req.session.user) {
            const isInCart = await cartHelper.isAProductInCart(req.session.user._id, product._id);
            // console.log("bbbbbbbbbbbbb");
            // // console.log(response[i].product_name);
            // console.log(isInCart);
            // console.log("bbbbbbbbbbbbb");

            product.isInCart = isInCart;
        }
        product.product_price = currencyFormat(product.product_price)
        // console.log("_________");
        // console.log(product);
        // console.log("_________");

        res.render('user/quick-view', { product, cartCount, loginStatus, wishListCount });


    } catch (error) {
        console.log(error);
    }
}

//---------------------------------------------------------


const wishlist = async (req, res) => {
    try {
        let userId = req.session.user._id;
        console.log(userId);
        let wishList = await wishListHelper.getAllWishListItems(userId);
        console.log("wiaashlist items");
        console.log(wishList);
        console.log("wiaashlist items");
        res.render('user/wishlist', { loginStatus, wishList, cartCount, wishListCount })

    } catch (error) {
        res.redirect('404')
    }
}


const addToWishList = async (req, res) => {
    try {
        console.log("ppppppppppppppppppppppppppppppppppppppppppppppppppppgggggggggggggggggggggggggggggggggggggggggggg");
        let productId = req.body.productId;
        let user = req.session.user._id;

        console.log("productId ", productId);
        console.log("user ", user);

        let result = wishListHelper.addItemToWishList(productId, user)

        res.json({ message: `item added to wishList ${productId}` })
    } catch (error) {
        console.log(error);
    }
}

const removeFromWishList = async (req, res) => {
    // console.log();
    try {
        let userId = req.session.user._id;
        let productId = req.body.productId;

        await wishListHelper.removeAnItemFromWishList(userId, productId);
        wishListCount = await wishListHelper.getWishListCount(userId)
        res.status(200).json({ message: "product removed from wishList", wishListCount })
    } catch (error) {
        res.redirect('/error')
    }
}
//---------------------------------------------------------

const cart = async (req, res) => {
    console.log("in cart");
    try {
        let user = req.session.user;
        let cartItems = await cartHelper.getAllCartItems(user._id)
        cartCount = await cartHelper.getCartCount(user._id)
        wishListCount = await wishListHelper.getWishListCount(user._id)
        let totalandSubTotal = await cartHelper.totalSubtotal(user._id, cartItems)

        totalandSubTotal = currencyFormatWithFractional(totalandSubTotal)
        console.log("cartItems");
        console.log(cartItems);
        console.log("cartItems");
        res.render('user/cart', { loginStatus, cartItems, cartCount, totalAmount: totalandSubTotal, wishListCount })
    } catch (error) {
        console.log(error);
    }
}


const addToCart = async (req, res) => {
    try {
        let productId = req.params.id;
        console.log("productId", productId, "productId");
        let user = req.session.user;
        let response = await cartHelper.addToUserCart(user._id, productId);
        if (response) {
            console.log(response);
            cartCount = await cartHelper.getCartCount(user._id)
            wishListCount = await wishListHelper.getWishListCount(user._id)
            res.status(202).json({ status: "success", message: "product added to cart" })
        }
    } catch (error) {
        console.log(error);
    }
}

//;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

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

        obj.quantity = response.newQuantity;

        let cartItems = await cartHelper.getAllCartItems(user._id)
        obj.totalAmount = await cartHelper.totalSubtotal(user._id, cartItems)

        obj.totalAmount = obj.totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' })
        // console.log(obj);


        if (response.isOutOfStock) {
            res.status(202).json({ OutOfStock: true, message: obj })
        } else {
            res.status(202).json({ OutOfStock: false, message: obj })
        }

    } catch (error) {
        console.log(error);
    }
}

const removeFromCart = (req, res) => {
    try {
        let userId = req.session.user._id;
        let cartId = req.body.cartId;
        let productId = req.params.id

        // console.log("hello");
        // console.log(productId);
        // console.log(cartId);
        // console.log("hello");

        cartHelper.removeAnItemFromCart(cartId, productId)
            .then(async (response) => {
                console.log("sucessfully deleted");
                let cartItems = await cartHelper.getAllCartItems(userId)
                let totalAmount = await cartHelper.totalSubtotal(userId, cartItems);
                totalAmount = totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' })

                let cartCount = await cartHelper.getCartCount(userId)
                wishListCount = await wishListHelper.getWishListCount(userId)
                console.log(totalAmount, ".....///");
                res.status(202).json({ message: "sucessfully item removed", totalAmount, cartCount, wishListCount })
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
        console.log("controller", req.params.id);
        let address = await addressHelper.getAnAddress(req.params.id);
        console.log("controller", address);
        res.json({ address: address })
    } catch (error) {
        console.log(error);
    }
}

const editAddressPost = async (req, res) => {
    try {

        let addressUpdated = await addressHelper.editAnAddress(req.body);
        console.log(addressUpdated);
        res.json({ message: "address updated" })

    } catch (error) {
        console.log(error);
    }

}

const deleteAddressPost = async (req, res) => {
    try {
        console.log("Address id", req.params.id);
        await addressHelper.deleteAnAddress(req.params.id);
        res.json({ message: "address Deleted Successfully.." })

    } catch (error) {

    }

}

// ----------------------------------------------------------------------------------------------------
const checkout = async (req, res) => {     //to view details and price products that are going to order and manage address
    try {
        const user = req.session.user;

        let cartItems = await cartHelper.getAllCartItems(user._id);
        let walletBalance = await walletHelper.walletBalance(user._id)
        walletBalance = currencyFormat(walletBalance)
        console.log("walletBalance controller", walletBalance);

        let totalAmount = await cartHelper.totalSubtotal(user._id, cartItems);
        totalAmount = totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' })
        const userAddress = await addressHelper.findAddresses(user._id);
        console.log("[[[[[[[[[[[[[[[");
        console.log(cartItems);
        for (let i = 0; i < cartItems.length; i++) {
            cartItems[i].product.product_price = cartItems[i].product.product_price.toLocaleString('en-in', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

        }
        // console.log(loginStatus);
        console.log("[[[[[[[[[[[[[[[");

        res.render('user/checkout', { loginStatus, cartCount, wishListCount, walletBalance, user, totalAmount: totalAmount, cartItems, address: userAddress })         //loginstatus contain user login info
    } catch (error) {
        console.log(error);
        res.redirect('/404')
    }


}

const applyCoupon = async (req, res) => {
    try {
        const user = req.session.user
        const { totalAmount, couponCode } = req.body;
        console.log("hhhhhhhhhhhhh", couponCode);
        console.log("hhhhhhhhhhhhh", totalAmount);
        const response = await couponHelper.applyCoupon(user._id, couponCode);

        console.log("responseddddddddddddddddd", response);
        res.status(202).json(response);


    } catch (error) {

    }
}


const placeOrder = async (req, res) => {
    try {
        let userId = req.body.userId

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
        console.log(totalAmount, "totalAmount");

        // console.log(userId, "userId");
        // console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");

        // console.log(cartItems);
        // console.log(req.body);
        // console.log(userId);
        // console.log(req.body.payment);
        // console.log(req.body.addressSelected);
        // console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");


        if (req.body.payment == 'COD') {
            const placeOrder = await orderHepler.orderPlacing(req.body, totalAmount, cartItems)
                .then(async (orderDetails) => {
                    await productHelper.decreaseStock(cartItems);
                    await cartHelper.clearCart(userId);
                    // cartCount = await cartHelper.getCartCount(userId)
                    res.status(202).json({ paymentMethod: 'COD', message: "Purchase Done" })
                })
        }
        else if (req.body.payment == 'razorpay') {
            await orderHepler.orderPlacing(req.body, totalAmount, cartItems)
                .then(async (orderDetails) => {
                    // console.log("responseresponseresponseorderDetails",orderDetails);
                    await razorpay.razorpayOrderCreate(orderDetails._id, orderDetails.totalAmount)
                        .then(async (razorpayOrderDetails) => {
                            await orderHepler.changeOrderStatus(orderDetails._id, 'confirmed');
                            await productHelper.decreaseStock(cartItems);
                            await cartHelper.clearCart(userId);
                            res.json({ paymentMethod: 'razorpay', orderDetails, razorpayOrderDetails, razorpaykeyId: process.env.RAZORPAY_KEY_ID })
                        })

                })
        }
        else if (req.body.payment == 'wallet') {
            let isPaymentDone = await walletHelper.payUsingWallet(userId, totalAmount);
            if (isPaymentDone) {
                await orderHepler.orderPlacing(req.body, totalAmount, cartItems)
                    .then(async (orderDetails) => {
                        console.log("wallet order placed");
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
        console.log(error);
    }
}

//razorpay payment verification
const verifyPayment = async (req, res) => {
    const userId = req.session.user._id;
    console.log("verifyPaymentverifyPaymentverifyPayment", req.body);
    await razorpay.verifyPaymentSignature(req.body)
        .then(async (response) => {
            console.log(response);
            if (response.signatureIsValid) {
                console.log("order razorpay successfullllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll");
                await orderHepler.changeOrderStatus(req.body['orderDetails[_id]'], "confirmed");
                let cartItems = await cartHelper.getAllCartItems(userId);
                await productHelper.decreaseStock(cartItems);
                await cartHelper.clearCart(userId);


                res.status(200).json({ status: true })
            } else {
                res.status(200).json({ status: false })
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
        const user = req.session.user;
        const userOrderDetails = await orderHepler.getAllOrderDetailsOfAUser(user._id);
        for (let i = 0; i < userOrderDetails.length; i++) {
            userOrderDetails[i].orderDate = dateFormat(userOrderDetails[i].orderDate);
            userOrderDetails[i].totalAmount = currencyFormat(userOrderDetails[i].totalAmount);

        }
        console.log("orders", userOrderDetails);

        res.render('user/orders-user', { userOrderDetails, loginStatus, cartCount, wishListCount })
    } catch (error) {

    }
}

const productOrderDetails = async (req, res) => {
    try {
        console.log(req.params);
        const orderId = req.params.id;
        let orderDetails = await orderHepler.getOrderedUserDetailsAndAddress(orderId); //got user details
        // let orderDetails= await orderHelper.getOrderDetails(orderId)
        let productDetails = await orderHepler.getOrderedProductsDetails(orderId); //got ordered products details

        console.log(">>>>>>>>>>>>>>>>>>>>>>>");
        console.log("orderdetails", orderDetails);
        console.log("productDetails", productDetails);
        console.log("loginStatus", loginStatus);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>");

        res.render('user/order-details-user', { orderDetails, cartCount, wishListCount, productDetails, loginStatus })
    } catch (error) {
        console.log(error);
        res.redirect('/error')
    }
}

const cancelOrder = async (req, res) => {
    console.log("cancelOrder", req.body);
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
        const cancelled = await orderHepler.cancelOrder(userId, orderId)

        res.status(200).json({ isCancelled: true, message: "order canceled successfully" })

    } catch (error) {
        console.log(error);
    }
}

const returnOrder = async (req, res) => {
    console.log("returnOrder", req.body);
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
        const returnedResponse = await orderHepler.returnOrder(userId, orderId)
        console.log("returned returned returned", returnedResponse);

        res.status(200).json({ isreturned: 'return pending', message: "order returned Process Started" })


    } catch (error) {
        console.log(error);
    }
}
// ----------------------------------------------------------------------------------------------------




const contact = async (req, res) => {
    res.render('user/contact', { loginStatus, cartCount, wishListCount })
}

const searchProduct = async (req, res) => {
    let payload = req.body.payload.trim();
    console.log("searchResult", payload);
    try {
        let searchResult = await productSchema.find({ product_name: { $regex: new RegExp('^' + payload + '.*', 'i') } }).exec();
        console.log(searchResult);
        searchResult = searchResult.slice(0, 5);

        res.send({ searchResult })

    } catch (error) {
        res.status(500).redirect('/error')
    }
}

const errorPage = (req, res) => {
    res.render('error')
}

const notFound404 = async (req, res) => {
    res.render('404')
}

// convert a number to a indian currency format
function currencyFormat(amount) {
    return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
}

function currencyFormatWithFractional(amount) {
    return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
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
    about,
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
    // quickView,
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
    notFound404,
    // currencyFormat,
    // currencyFormatWithFractional,
}