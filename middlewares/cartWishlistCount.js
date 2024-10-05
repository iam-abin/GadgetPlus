const cartHelper = require('../helpers/cartHelper');
const wishListHelper = require('../helpers/wishListHelper');

const cartWishlistCount = async (req, res, next) => {
    const userId = req.session?.user?._id;
    if (userId) { // Check if the user is logged in
        try {
            const cartCount = await cartHelper.getCartCount(userId);
            const wishlistCount = await wishListHelper.getWishListCount(userId);
            res.locals.cartCount = cartCount;
            res.locals.wishlistCount = wishlistCount;
        } catch (err) {
            res.locals.cartCount = 0;
            res.locals.wishlistCount = 0;
        }
    } else {
        res.locals.cartCount = 0; // Default count if user is not logged in
        res.locals.wishlistCount = 0;
    }
    next();
};

module.exports = cartWishlistCount;
