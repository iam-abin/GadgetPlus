const userHelper = require("../../helpers/userHelper");

const userSignup = async (req, res) => {
    res.render("user/signup", { headerFooter: true });
};

const userSignupPost = async (req, res, next) => {
    try {
        const response = userHelper.doSignup(req.body);
        if (!response.userExist) {
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
        headerFooter: true,
        loggedInError: req.session.loggedInError,
    });
};

const userLoginPost = async (req, res, next) => {
    try {
        const response = await userHelper.doLogin(req.body);
        if (response.loggedIn) {
            req.session.user = response.user;
            res.status(202).json({
                error: false,
                message: response.logginMessage,
            });
        } else {
            res.status(401).json({
                error: false,
                message: response.logginMessage,
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


module.exports ={
    userSignup,
    userSignupPost,
    userLogin,
    userLoginPost,
    userLogout,
}