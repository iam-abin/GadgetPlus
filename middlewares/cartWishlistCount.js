const cartHelper = require('../helpers/cartHelper');
const User = require('../models/user');

const cartWishlistCount = async (req, res, next) => {
    let userId = req.session.user._id;
    if (userId) { // Check if the user is logged in
        try {
            cartCount = await cartHelper.getCartCount(userId);
            // const user = await User.findById(req.session.userId);
            res.locals.cartCount = cartCount;
            res.locals.wishlistCount = user.wishlist.length;
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
