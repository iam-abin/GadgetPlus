
const cart = async (req, res, next) => {
    try {
        let user = req.session.user;
        let cartItems = await cartHelper.getAllCartItems(user._id);
        cartCount = await cartHelper.getCartCount(user._id);
        wishListCount = await wishListHelper.getWishListCount(user._id);
        let totalandSubTotal = await cartHelper.totalSubtotal(
            user._id,
            cartItems
        );

        totalandSubTotal = formatCurrency(totalandSubTotal);
        res.render("user/cart", {
            loginStatus: req.session.user,
            cartItems,
            cartCount,
            totalAmount: totalandSubTotal,
            wishListCount,
        });
    } catch (error) {
        next(error);
    }
};

const addToCart = async (req, res, next) => {
    try {
        let productId = req.params.id;
        let user = req.session.user;
        console.log("/////////////////////");
        console.log(user);
        console.log("/////////////////////");
        let response = await cartHelper.addToUserCart(user._id, productId);
        if (response) {
            cartCount = await cartHelper.getCartCount(user._id);
            wishListCount = await wishListHelper.getWishListCount(user._id);
            res.status(202).json({
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
        let obj = {};
        let user = req.session.user;
        let productId = req.body.productId;
        let quantity = req.body.quantity;

        response = await cartHelper.incDecProductQuantity(
            user._id,
            productId,
            quantity
        );

        obj.quantity = response.newQuantity;

        let cartItems = await cartHelper.getAllCartItems(user._id);
        obj.totalAmount = await cartHelper.totalSubtotal(user._id, cartItems);

        obj.totalAmount = formatCurrency(obj.totalAmount);

        if (response.isOutOfStock) {
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
    const cartId = req.body.cartId;
    const productId = req.params.id;
    try {
        await cartHelper.removeAnItemFromCart(cartId, productId);

        let cartItems = await cartHelper.getAllCartItems(userId);
        let totalAmount = await cartHelper.totalSubtotal(userId, cartItems);
        totalAmount = formatCurrency(totalAmount);

        let cartCount = await cartHelper.getCartCount(userId);
        wishListCount = await wishListHelper.getWishListCount(userId);
        res.status(202).json({
            message: "sucessfully item removed",
            totalAmount,
            cartCount,
            wishListCount,
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
}