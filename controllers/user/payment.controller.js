const addressHelper = require("../../helpers/addressHelper");
const cartHelper = require("../../helpers/cartHelper");
const walletHelper = require("../../helpers/walletHelper");
const orderHelper = require("../../helpers/orderHepler");
const { formatCurrency } = require("../../utils/currency-format");
const razorpay = require("../../api/razorpay");
const productHelper = require("../../helpers/productHelper");

const checkout = async (req, res, next) => {
    //to view details and price products that are going to order and manage address
    try {
        const { user } = req.session;

        let cartItems = await cartHelper.getAllCartItems(user._id);
        let walletBalance = await walletHelper.walletBalance(user._id);
        walletBalance = formatCurrency(walletBalance);

        let totalAmount = await cartHelper.totalSubtotal(user._id);
        totalAmount = totalAmount.toLocaleString("en-in", {
            style: "currency",
            currency: "INR",
        });
        const userAddress = await addressHelper.findAddresses(user._id);

        for (let i = 0; i < cartItems.length; i++) {
            cartItems[i].product.product_price = cartItems[
                i
            ].product.product_price.toLocaleString("en-in", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            });
        }

        res.render("user/checkout", {
            loginStatus: req.session.user,
            walletBalance,
            user,
            totalAmount: totalAmount,
            cartItems,
            address: userAddress,
        }); //loginstatus contain user login info
    } catch (error) {
        next(error);
    }
};

//razorpay payment verification
const verifyPayment = async (req, res, next) => {
    const userId = req.session.user._id;
    try {
        const response = await razorpay.verifyPaymentSignature(req.body);
        if (response.signatureIsValid) {
            await orderHelper.changeOrderStatus(
                req.body["orderDetails[_id]"],
                "confirmed"
            );
            let cartItems = await cartHelper.getAllCartItems(userId);
            await productHelper.decreaseStock(cartItems);
            await cartHelper.clearCart(userId);

            res.status(200).json({ status: true });
        } else {
            res.status(200).json({ status: false });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkout,
    verifyPayment,
};
