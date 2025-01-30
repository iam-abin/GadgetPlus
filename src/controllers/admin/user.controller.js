const { ADMIN_LAYOUT } = require("../../constants/layout");
const adminHelper = require("../../helpers/adminHelper");
const orderHelper = require("../../helpers/orderHepler");
const { currencyFormatWithoutDecimal } = require("../../utils/currency-format");
const { formatDate } = require("../../utils/date-format");

const usersList = async (req, res, next) => {
    try {
        const users = await adminHelper.findUsers();
        res.status(200).render("admin/users-list", {
            layout: ADMIN_LAYOUT,
            users: users,
        });
    } catch (error) {
        next(error);
    }
};

const blockUnBlockUser = async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await adminHelper.blockOrUnBlockUser(userId);

        if (user.isActive) {
            res.status(200).json({
                error: false,
                message: "User has been unBlocked",
                user: user,
            });
        } else {
            req.session.user = false;

            res.status(200).json({
                error: false,
                message: "User has been Blocked",
                user: user,
            });
        }
    } catch (error) {
        next(error);
    }
};

const userProfile = async (req, res, next) => {
    try {
        const userOrderDetails = await orderHelper.getAllOrderDetailsOfAUser(
            req.params.id
        );
        for (let i = 0; i < userOrderDetails.length; i++) {
            userOrderDetails[i].totalAmount = currencyFormatWithoutDecimal(
                userOrderDetails[i].totalAmount
            );
            userOrderDetails[i].orderDate = formatDate(
                userOrderDetails[i].orderDate
            );
        }
        const user = await adminHelper.findAUser(req.params.id);
        res.render("admin/user-profile", {
            layout: ADMIN_LAYOUT,
            user: user,
            userOrderDetails,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    usersList,
    blockUnBlockUser,
    userProfile,
};
