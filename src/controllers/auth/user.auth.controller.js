const userHelper = require("../../helpers/userHelper");

const userSignup = async (req, res) => {
    res.render("user/signup", { noHeaderFooter: true });
};

const userSignupPost = async (req, res, next) => {
    try {
        const signupResponse = await userHelper.doSignup(req.body);
        if (!signupResponse.userExist) {
            res.redirect("/user-login");
        } else {
            res.redirect("/");
        }
    } catch (error) {
        next(error);
    }
};

const userLogin = async (req, res) => {
    res.render("user/login", {
        noHeaderFooter: true,
        loggedInError: req.session.loggedInError,
    });
};

const userLoginPost = async (req, res, next) => {
    try {
        const loggedInResponse = await userHelper.doLogin(req.body);
        if (loggedInResponse.loggedIn) {
            req.session.user = loggedInResponse.user;
            res.status(200).json({
                error: false,
                message: loggedInResponse.logginMessage,
            });
        } else {
            res.status(401).json({
                error: false,
                message: loggedInResponse.logginMessage,
            });
        }
    } catch (error) {
        next(error);
    }
};

const userLogout = async (req, res, next) => {
    try {
        req.session.user = null;
        res.redirect("/");
    } catch (error) {
        next(error);
    }
};

module.exports = {
    userSignup,
    userSignupPost,
    userLogin,
    userLoginPost,
    userLogout,
};
