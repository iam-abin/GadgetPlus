const cartHelper = require("../../helpers/cartHelper");
const productHelper = require("../../helpers/productHelper");
const wishListHelper = require("../../helpers/wishListHelper");
const { formatCurrency } = require("../../utils/currency-format");

const landingPage = async (req, res, next) => {
    try {
        let latestProducts = await productHelper.getRecentProducts();
        let featuredProducts = await productHelper.getFeaturedProducts();

        // console.log("latestProducts ",latestProducts);

        for (let i = 0; i < 5; i++) {
            latestProducts[i].product_price = formatCurrency(
                latestProducts[i]?.product_price ?? 0
            );
            if (i < featuredProducts.length) {
                featuredProducts[i].product_price = formatCurrency(
                    featuredProducts[i]?.product_price ?? 0
                );
            }
        }

        res.render("user/index", {
            loginStatus: req.session.user,
            latestProducts,
            featuredProducts,
        });
    } catch (error) {
        next(error);
    }
};

const userHome = async (req, res, next) => {
    try {
        let userId = req.session.user._id;
        cartCount = await cartHelper.getCartCount(userId);
        wishListCount = await wishListHelper.getWishListCount(userId);
        let latestProducts = await productHelper.getRecentProducts();
        let featuredProducts = await productHelper.getFeaturedProducts();

        for (let i = 0; i < latestProducts.length; i++) {
            const isInWishList = await wishListHelper.isProductInWishList(
                userId,
                latestProducts[i]._id
            );
            const isInCart = await cartHelper.isAProductInCart(
                userId,
                latestProducts[i]._id
            );

            latestProducts[i].isInWishList = isInWishList;
            latestProducts[i].isInCart = isInCart;

            latestProducts[i].product_price = formatCurrency(
                latestProducts[i].product_price
            );
        }

        for (let i = 0; i < featuredProducts.length; i++) {
            const isInWishList = await wishListHelper.isProductInWishList(
                userId,
                featuredProducts[i]._id
            );
            const isInCart = await cartHelper.isAProductInCart(
                userId,
                featuredProducts[i]._id
            );

            featuredProducts[i].isInWishList = isInWishList;
            featuredProducts[i].isInCart = isInCart;

            featuredProducts[i].product_price = formatCurrency(
                featuredProducts[i].product_price
            );
        }

        res.status(200).render("user/index", {
            loginStatus: req.session.user,
            cartCount,
            wishListCount,
            latestProducts,
            featuredProducts,
        });
    } catch (error) {
        next(error);
    }
};

const contact = (req, res) => {
    res.render("user/contact", {
        loginStatus: req.session.user,
        cartCount,
        wishListCount,
    });
};


module.exports = {
    landingPage,
    userHome,
    contact,
}