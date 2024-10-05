
const viewProducts = async (req, res, next) => {
    try {
        console.log("THis is view prodict controller");

        let products;
        // let minAmount= await productHelper.getMinimumPrice();
        // let maxAmount= await productHelper.getMaximumPrice();
        // const page = req.params.page;
        // const perPage = 2;
        if (req.session.user) {
            let userId = req.session.user._id;
            cartCount = await cartHelper.getCartCount(userId);
            wishListCount = await wishListHelper.getWishListCount(userId);
        }

        // console.log("======================================");
        // console.log(req.query.filterData);
        // console.log("======================================");

        if (!req.query.filterData) {
            products = await productHelper.getAllProductsWithLookup();
            for (let i = 0; i < products.length; i++) {
                if (req.session.user) {
                    let userId = req.session.user._id;
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
                loginStatus: req.session.user,
                cartCount,
                wishListCount,
            });
        } else {
            let filterData = JSON.parse(req.query.filterData);
            console.log(filterData, "filterData");
            if (filterData.selectedCategories.length) {
                products = await productHelper.filterProduct(filterData);
                for (let i = 0; i < products.length; i++) {
                    if (req.session.user) {
                        let userId = req.session.user._id;
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
                    loginStatus: req.session.user,
                    cartCount,
                    wishListCount,
                });
            } else {
                products = await productHelper.getAllProductsWithLookup();
                for (let i = 0; i < products.length; i++) {
                    if (req.session.user) {
                        let userId = req.session.user._id;
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
                    loginStatus: req.session.user,
                    cartCount,
                    wishListCount,
                });
            }
        }
    } catch (error) {
        next(error);
    }
};

const viewAProduct = async (req, res, next) => {
    try {
        let productSlug = req.params.slug;
        let product = await productHelper.getAProduct(productSlug);
        if (req.session.user) {
            const isInCart = await cartHelper.isAProductInCart(
                req.session.user._id,
                product._id
            );
            const isInWishList = await wishListHelper.isProductInWishList(
                req.session.user._id,
                product._id
            );

            product.isInWishList = isInWishList;
            product.isInCart = isInCart;
        }
        product.product_price = formatCurrency(product.product_price);
        res.render("user/quick-view", {
            product,
            cartCount,
            loginStatus: req.session.user,
            wishListCount,
        });
    } catch (error) {
        next(error);
    }
};


const searchProduct = async (req, res, next) => {
    let payload = req.body.payload.trim();
    try {
        let searchResult = await productSchema
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
}