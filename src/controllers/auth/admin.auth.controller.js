const { ADMIN_LAYOUT } = require("../../config/constants");
const adminHelper = require("../../helpers/adminHelper");

const adminLogin = async (req, res, next) => {
    try {
        res.render("admin/adminLogin", {
            layout: ADMIN_LAYOUT,
            admin: true,
        });
    } catch (error) {
        next(error);
    }
};

const adminLoginPost = async (req, res, next) => {
    const adminName = req.body.email; //email
    const adminPassword = req.body.password;
    try {
        const adminDetails = await adminHelper.isAdminExists(
            adminName,
            adminPassword
        );
        if (adminDetails) {
            req.session.admin = adminDetails;
        }
        // If admin details are correct the go to admin home page else will go to login page.
        res.redirect("/admin");
    } catch (error) {
        next(error);
    }
};

const adminLogout = (req, res) => {
    req.session.admin = false;
    res.redirect("/admin");
};

module.exports = {
    adminLogin,
    adminLoginPost,
    adminLogout,
};
