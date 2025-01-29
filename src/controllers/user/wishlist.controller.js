const cartHelper = require("../../helpers/cartHelper");
const wishListHelper = require("../../helpers/wishListHelper");
const { formatCurrency } = require("../../utils/currency-format");

const wishlist = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        if (userId) {
            let wishList = await wishListHelper.getAllWishListItems(userId);

            for (let i = 0; i < wishList.length; i++) {
                const isInCart = await cartHelper.isAProductInCart(
                    userId,
                    wishList[i].product._id
                );

                wishList[i].product.isInCart = isInCart;

                wishList[i].product.product_price = formatCurrency(
                    wishList[i].product.product_price
                );
            }
        }
    } catch (error) {
        next(error);
    }
};

const addToWishList = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const user = req.session.user._id;
        await wishListHelper.addItemToWishList(productId, user);
        res.status(201).json({ message: `item added to wishList` });
    } catch (error) {
        next(error);
    }
};

const removeFromWishList = async (req, res, next) => {
    const userId = req.session.user._id;
    const { productId } = req.body;
    try {
        await wishListHelper.removeAnItemFromWishList(userId, productId);
        const wishListCount = await wishListHelper.getWishListCount(userId);
        res.status(200).json({
            message: "product removed from wishList",
            wishListCount
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    wishlist,
    addToWishList,
    removeFromWishList,
};
