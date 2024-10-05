const couponHelper = require("../../helpers/coupenHelper");

const applyCoupon = async (req, res, next) => {
    try {
        const user = req.session.user;
        const { totalAmount, couponCode } = req.body;
        const response = await couponHelper.applyCoupon(user._id, couponCode);

        res.status(202).json(response);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    applyCoupon,
};
