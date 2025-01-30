const { ADMIN_LAYOUT } = require("../../constants/layout");
const coupenHelper = require("../../helpers/coupenHelper");
const { currencyFormatWithoutDecimal } = require("../../utils/currency-format");
const { formatDate } = require("../../utils/date-format");

const coupons = async (req, res, next) => {
    try {
        let allCoupons = await coupenHelper.getAllCoupons();

        for (let i = 0; i < allCoupons.length; i++) {
            allCoupons[i].discount = currencyFormatWithoutDecimal(
                allCoupons[i].discount
            );
            allCoupons[i].expiryDate = formatDate(allCoupons[i].expiryDate);
        }
        res.render("admin/coupon", {
            coupons: allCoupons,
            layout: ADMIN_LAYOUT,
        });
    } catch (error) {
        next(error);
    }
};

const postAddCoupon = async (req, res, next) => {
    try {
        await coupenHelper.addCouponToDb(req.body);
        res.status(201).redirect("/admin/coupon");
    } catch (error) {
        next(error);
    }
};

// To show the coupon data to edit
const editCoupon = async (req, res, next) => {
    try {
        const couponData = await coupenHelper.getACoupenData(req.params.id);
        res.status(200).json({ couponData });
    } catch (error) {
        next(error);
    }
};

// To update coupon changes
const editCouponPost = async (req, res, next) => {
    try {
        await coupenHelper.editCoupon(req.body);
        res.status(201).redirect("/admin/coupon");
    } catch (error) {
        next(error);
    }
};

const deleteCoupon = async (req, res, next) => {
    try {
        await coupenHelper.deleteACoupon(req.params.id);
        res.status(200).json({ message: "coupon deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    coupons,
    postAddCoupon,
    editCoupon,
    editCouponPost,
    deleteCoupon,
};
