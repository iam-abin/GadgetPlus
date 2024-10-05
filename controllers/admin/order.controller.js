const orderHelper = require("../../helpers/orderHepler");
const productHelper = require("../../helpers/productHelper");
const walletHelper = require("../../helpers/walletHelper");
const { currencyFormatWithoutDecimal } = require("../../utils/currency-format");
const { formatDate } = require("../../utils/date-format");

const productOrders = async (req, res, next) => {
    try {
        let orders = await orderHelper.getAllOrders();
        for (let i = 0; i < orders.length; i++) {
            orders[i].totalAmount = currencyFormatWithoutDecimal(
                orders[i].totalAmount
            );
            orders[i].orderDate = formatDate(orders[i].orderDate);
        }
        res.render("admin/orders", { layout: ADMIN_LAYOUT, orders });
    } catch (error) {
        next(error);
    }
};

const changeProductOrderStatus = async (req, res, next) => {
    try {
        const response = await orderHelper.changeOrderStatus(
            req.body.orderId,
            req.body.status
        );

        if (response.orderStatus == "returned") {
            await walletHelper.addMoneyToWallet(
                response.user,
                response.totalAmount
            );
            await productHelper.increaseStock(response);
        }
        res.status(200).json({
            error: false,
            message: "order status updated",
            status: response.orderStatus,
        });
    } catch (error) {
        next(error);
    }
};

const productOrderDetails = async (req, res, next) => {
    try {
        const orderId = req.params.id;
        let orderdetails = await orderHelper.getOrderedUserDetailsAndAddress(
            orderId
        ); //got user details
        let productDetails = await orderHelper.getOrderedProductsDetails(
            orderId
        ); //got ordered products details

        for (let i = 0; i < orderdetails.length; i++) {
            orderdetails[i].discount = currencyFormatWithoutDecimal(
                orderdetails[i].discount
            );
        }

        for (let i = 0; i < productDetails.length; i++) {
            productDetails[i].orderedProduct.totalPriceOfOrderedProducts =
                currencyFormatWithoutDecimal(
                    productDetails[i].orderedProduct.product_price *
                        productDetails[i].orderedItems.quantity
                );
            productDetails[i].orderedProduct.product_price =
                currencyFormatWithoutDecimal(
                    productDetails[i].orderedProduct.product_price
                );
        }

        orderdetails.totalAmount = currencyFormatWithoutDecimal(
            orderdetails.totalAmount
        );
        res.render("admin/order-details", {
            orderdetails,
            productDetails,
            layout: ADMIN_LAYOUT,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    productOrders,
    changeProductOrderStatus,
    productOrderDetails,
};
