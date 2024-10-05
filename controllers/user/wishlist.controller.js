
const wishlist = async (req, res, next) => {
    try {
        let userId = req.session.user._id;
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
            console.log("wishlist ==>", wishlist);
            res.render("user/wishlist", {
                loginStatus: req.session.user,
                wishList,
                cartCount,
                wishListCount,
            });
        }
    } catch (error) {
        next(error);
    }
};

const addToWishList = async (req, res, next) => {
    try {
        let productId = req.body.productId;
        let user = req.session.user._id;
        wishListHelper.addItemToWishList(productId, user);
        console.log(`item added to wishList ${productId}`);
        res.json({ message: `item added to wishList` });
    } catch (error) {
        next(error);
    }
};

const removeFromWishList = async (req, res, next) => {
    let userId = req.session.user._id;
    let productId = req.body.productId;
    try {
        await wishListHelper.removeAnItemFromWishList(userId, productId);
        wishListCount = await wishListHelper.getWishListCount(userId);
        res.status(200).json({
            message: "product removed from wishList",
            wishListCount,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    wishlist,
    addToWishList,
    removeFromWishList,
}