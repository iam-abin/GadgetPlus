const forgotPassword = (req, res) => {
    res.render("user/otp-mobile-forgotpswd");
};

const resetPassword = async (req, res, next) => {
    try {
        const phone = req.session.mobile;
        let newPassword = req.body.confirmPassword;
        await userHelper.changePassword(newPassword, phone);
        res.redirect("/user-login");
    } catch (error) {
        next(error);
    }
};


module.exports = {
    forgotPassword,
    resetPassword,
}