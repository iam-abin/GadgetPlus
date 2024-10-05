const userHelper = require("../../helpers/userHelper");

const forgotPassword = (req, res) => {
    res.render("user/otp-mobile-forgotpswd");
};

const resetPassword = async (req, res, next) => {
    try {
        const { mobile } = req.session;
        let newPassword = req.body.confirmPassword;
        await userHelper.changePassword(newPassword, mobile);
        res.redirect("/user-login");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
};
