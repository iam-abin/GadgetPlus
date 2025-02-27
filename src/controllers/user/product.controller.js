const cartHelper = require("../../helpers/cartHelper");
const productHelper = require("../../helpers/productHelper");
const wishListHelper = require("../../helpers/wishListHelper");
const productModel = require("../../models/productModel");
const { formatCurrency } = require("../../utils/currency-format");

const viewProducts = async (req, res, next) => {
    try {
        let products;
        let user;
        if (req.session.user) {
            user = req.session.user;
        }

        if (!req.query.filterData) {
            products = await productHelper.getAllProductsWithLookup();
            for (let i = 0; i < products.length; i++) {
                if (user) {
                    let userId = user._id;
                    const isInCart = await cartHelper.isAProductInCart(
                        userId,
                        products[i]._id
                    );
                    const isInWishList =
                        await wishListHelper.isProductInWishList(
                            userId,
                            products[i]._id
                        );

                    products[i].isInCart = isInCart;
                    products[i].isInWishList = isInWishList;
                }
                products[i].product_price = Number(
                    products[i].product_price
                ).toLocaleString("en-in", {
                    style: "currency",
                    currency: "INR",
                });
            }

            res.render("user/view-products", {
                product: products,
                loginStatus: user,
            });
        } else {
            let filterData = JSON.parse(req.query.filterData);
                products = await productHelper.filterProduct(filterData);
                for (let i = 0; i < products.length; i++) {
                    if (user) {
                        let userId = user._id;
                        const isInCart = await cartHelper.isAProductInCart(
                            userId,
                            products[i]._id
                        );
                        const isInWishList =
                            await wishListHelper.isProductInWishList(
                                userId,
                                products[i]._id
                            );

                        products[i].isInCart = isInCart;
                        products[i].isInWishList = isInWishList;
                    }
                    products[i].product_price = Number(
                        products[i].product_price
                    ).toLocaleString("en-in", {
                        style: "currency",
                        currency: "INR",
                    });
                }
                res.json({
                    product: products,
                    loginStatus: user,
                });
        }
    } catch (error) {
        next(error);
    }
};

const viewAProduct = async (req, res, next) => {
    try {
        let productSlug = req.params.slug;
        let product = await productHelper.getAProduct(productSlug);
        let user;
        if (req.session.user) user = req.session.user;
        if (user) {
            const isInCart = await cartHelper.isAProductInCart(
                user._id,
                product._id
            );
            const isInWishList = await wishListHelper.isProductInWishList(
                user._id,
                product._id
            );

            product.isInWishList = isInWishList;
            product.isInCart = isInCart;
        }
        product.product_price = formatCurrency(product.product_price);
        res.render("user/quick-view", {
            product,
            loginStatus: user,
        });
    } catch (error) {
        next(error);
    }
};

const searchProduct = async (req, res, next) => {
    let payload = req.body.payload.trim();
    try {
        let searchResult = await productModel
            .find({
                product_name: { $regex: new RegExp("^" + payload + ".*", "i") },
            })
            .exec();
        searchResult = searchResult.slice(0, 5);
        res.send({ searchResult });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    viewProducts,
    viewAProduct,
    searchProduct,
};
