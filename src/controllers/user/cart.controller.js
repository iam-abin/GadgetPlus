const cartHelper = require("../../helpers/cartHelper");
const { formatCurrency } = require("../../utils/currency-format");

const cart = async (req, res, next) => {
    try {
        const { user } = req.session;
        const cartItems = await cartHelper.getAllCartItems(user._id);

        let totalandSubTotal = await cartHelper.totalSubtotal(
            user._id,
        );

        totalandSubTotal = formatCurrency(totalandSubTotal);

        res.render("user/cart", {
            loginStatus: req.session.user,
            cartItems,
            totalAmount: totalandSubTotal,
        });
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        let productId = req.params.id;
        const { user } = req.session;

        const addedItem = await cartHelper.addToUserCart(user._id, productId);
        if (addedItem) {
            res.status(201).json({
                status: "success",
                message: "product added to cart",
            });
        }
    } catch (error) {
        next(error);
    }
};

const incDecQuantity = async (req, res, next) => {
    try {
        const obj = {};
        const { user } = req.session;
        const { productId, quantity } = req.body;

        const cartItem = await cartHelper.incDecProductQuantity(
            user._id,
            productId,
            quantity
        );

        obj.quantity = cartItem.newQuantity;

        obj.totalAmount = await cartHelper.totalSubtotal(user._id);

        obj.totalAmount = formatCurrency(obj.totalAmount);

        if (cartItem.isOutOfStock) {
            res.status(202).json({ OutOfStock: true, message: obj });
        } else {
            res.status(202).json({ OutOfStock: false, message: obj });
        }
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    const userId = req.session.user._id;
    const { cartId } = req.body;
    const productId = req.params.id;
    try {
        await cartHelper.removeAnItemFromCart(cartId, productId);

        
        let totalAmount = await cartHelper.totalSubtotal(userId);
        totalAmount = formatCurrency(totalAmount);

        res.status(200).json({
            message: "sucessfully item removed",
            totalAmount,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    cart,
    addToCart,
    incDecQuantity,
    removeFromCart,
};
