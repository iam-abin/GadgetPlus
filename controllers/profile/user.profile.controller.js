const addressHelper = require("../../helpers/addressHelper");

const profile = async (req, res, next) => {
    try {
        let userId = req.session.user._id;
        let addresses = await addressHelper.findAddresses(userId);
        res.render("user/profile", {
            loginStatus: req.session.user,
            addresses,
            cartCount,
            wishListCount,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    profile
}