
const placeOrder = async (req, res, next) => {
    try {
        let userId = req.body.userId;
        let paymentType = req.body.payment;
        let cartItems = await cartHelper.getAllCartItems(userId);
        let coupon = await couponSchema.find({ user: userId });

        console.log("========inside place order conteroller==============>");
        if (!cartItems.length)
            return res.send({
                error: true,
                message: "Please add items to cart before checkout",
            });
        console.log("1");

        if (!req.body.addressSelected)
            return res
                .status(400)
                .send({ error: true, message: "Please Choose Address" });
        console.log("2");
        if (!paymentType)
            return res.status(400).send({
                error: true,
                message: "Please Choose A Payment Method",
            });

        const totalAmount = await cartHelper.totalAmount(userId);

        switch (paymentType) {
            case "COD":
                const orderDetailsCOD = await orderHelper.orderPlacing(
                    req.body,
                    totalAmount,
                    cartItems
                );

                await productHelper.decreaseStock(cartItems);
                await cartHelper.clearCart(userId);
                res.status(202).json({
                    paymentMethod: "COD",
                    message: "Purchase Done",
                });
                break;
            case "razorpay":
                const orderDetailsRazorpay = await orderHelper.orderPlacing(
                    req.body,
                    totalAmount,
                    cartItems
                );
                const razorpayOrderDetails = await razorpay.razorpayOrderCreate(
                    orderDetailsRazorpay._id,
                    orderDetailsRazorpay.totalAmount
                );
                await orderHelper.changeOrderStatus(
                    orderDetailsRazorpay._id,
                    "confirmed"
                );
                await productHelper.decreaseStock(cartItems);
                await cartHelper.clearCart(userId);
                res.json({
                    paymentMethod: "razorpay",
                    orderDetails: orderDetailsRazorpay,
                    razorpayOrderDetails,
                    razorpaykeyId: process.env.RAZORPAY_KEY_ID,
                });
                break;
            case "wallet":
                console.log("3");
                console.log("3 totalAmount", totalAmount);
                let isPaymentDone = await walletHelper.payUsingWallet(
                    userId,
                    totalAmount
                );
                console.log("isPaymentDone ", isPaymentDone);
                if (isPaymentDone) {
                    const orderDetailsWallet = await orderHelper.orderPlacing(
                        req.body,
                        totalAmount,
                        cartItems
                    );
                    await orderHelper.changeOrderStatus(
                        orderDetailsWallet._id,
                        "confirmed"
                    );
                    await productHelper.decreaseStock(cartItems);
                    await cartHelper.clearCart(userId);
                    res.status(202).json({
                        paymentMethod: "wallet",
                        error: false,
                        message: "Purchase Done",
                    });
                } else {
                    res.status(200).json({
                        paymentMethod: "wallet",
                        error: true,
                        message: "Insufficient Balance in wallet",
                    });
                }
                break;
            default:
                // Handle default case if needed
                break;
        }
    } catch (error) {
        console.error("Error processing payment:", error);
        next(error);
    }
};

const orderSuccess = (req, res, next) => {
    try {
        res.render("user/order-success", { loginStatus: req.session.user });
    } catch (error) {
        next(error);
    }
};

//to find all orders details of a user
const orders = async (req, res, next) => {
    try {
        const user = req.session.user;
        const userOrderDetails = await orderHelper.getAllOrderDetailsOfAUser(
            user._id
        );
        for (let i = 0; i < userOrderDetails.length; i++) {
            userOrderDetails[i].orderDate = formatDate(
                userOrderDetails[i].orderDate
            );
            userOrderDetails[i].totalAmount = formatCurrency(
                userOrderDetails[i].totalAmount
            );
        }
        res.render("user/orders-user", {
            userOrderDetails,
            loginStatus: req.session.user,
            cartCount,
            wishListCount,
        });
    } catch (error) {
        next(error);
    }
};

const productOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        let orderDetails = await orderHelper.getOrderedUserDetailsAndAddress(
            orderId
        ); //got user details
        let productDetails = await orderHelper.getOrderedProductsDetails(
            orderId
        ); //got ordered products details
        res.render("user/order-details-user", {
            orderDetails,
            cartCount,
            wishListCount,
            productDetails,
            loginStatus: req.session.user,
            formatCurrency,
        });
    } catch (error) {
        next(error);
    }
};

const cancelOrder = async (req, res, next) => {
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
        await orderHelper.cancelOrder(userId, orderId);
        res.status(200).json({
            isCancelled: true,
            message: "order canceled successfully",
        });
    } catch (error) {
        next(error);
    }
};

const returnOrder = async (req, res, next) => {
    const userId = req.body.userId;
    const orderId = req.body.orderId;
    try {
        await orderHelper.returnOrder(userId, orderId);
        res.status(200).json({
            isreturned: "return pending",
            message: "order returned Process Started",
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    placeOrder,
    orderSuccess,
    orders,
    productOrderDetails,
    cancelOrder,
    returnOrder,
}