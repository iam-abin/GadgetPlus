const twilio = require("../../api/twilio");

const otpSendingForgot = async (req, res, next) => {
    try {
        const find = req.body;

        req.session.mobile = find.phone;
        const userWithNumber = await userSchema.findOne({ phone: find.phone });
        if (userWithNumber) {
            await twilio.sentOtp(find.phone);
            res.render("user/otp-fill-forgotpswd");
        } else {
            res.redirect("/user-signup");
        }
        // .catch((error) => {
        // 	res.redirect("/user-signup");
        // });
    } catch (error) {
        next(error);
    }
};

const otpVerifyingForgot = async (req, res, next) => {
    const phone = req.session.mobile;
    const otp = req.body.otp;

    try {
        const status = await twilio.verifyOtp(phone, otp);
        if (status) {
            res.render("user/resetPassword");
        } else {
            res.redirect("/user-signup");
        }
    } catch (error) {
        next(error);
    }
};


// otp login page
const otpUser = (req, res) => {
    res.render("user/otp-form", { loginStatus: req.session.user });
};

// otp sending in login process
const otpSending = async (req, res, next) => {
    const find = req.body;
    req.session.mobile = req.body.phone;
    try {
        const userData = await userSchema.findOne({ phone: find.phone });
        if (userData) {
            req.session.tempUser = userData;
            await twilio.sentOtp(find.phone);
            res.render("user/otp-fill");
        } else {
            res.redirect("/user-signup");
        }

        // .catch((error) => {
        // 	res.redirect("/user-signup");
        // });
    } catch (error) {
        next(error);
    }
};

// otp verification process
const otpVerifying = async (req, res, next) => {
    const phone = req.session.mobile;
    const otp = req.body.otp;

    try {
        const status = await twilio.verifyOtp(phone, otp);
        if (status) {
            req.session.user = req.session.tempUser;
            res.redirect("/");
        } else {
            res.redirect("/user-signup");
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    otpSendingForgot,
    otpVerifyingForgot,
    otpUser,
    otpSending,
    otpVerifying,
}