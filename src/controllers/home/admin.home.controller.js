const adminHelper = require("../../helpers/adminHelper");
const orderHelper = require("../../helpers/orderHepler");

const { currencyFormatWithoutDecimal } = require("../../utils/currency-format");

const { ADMIN_LAYOUT } = require("../../constants/layout");

const adminHome = async (req, res, next) => {
    try {
        const orderStatus = await orderHelper.getAllOrderStatusesCount();
        const chartData = await adminHelper.getChartDetails();
        const dashboardDetails = await adminHelper.getDashboardDetails();

        dashboardDetails.totalRevenue = dashboardDetails.totalRevenue
            ? currencyFormatWithoutDecimal(dashboardDetails.totalRevenue)
            : 0;
        dashboardDetails.monthlyRevenue = dashboardDetails.monthlyRevenue
            ? currencyFormatWithoutDecimal(dashboardDetails.monthlyRevenue)
            : 0;

        res.render("admin/admin-home", {
            orderStatus,
            chartData,
            dashboardDetails,
            layout: ADMIN_LAYOUT,
        });
    } catch (error) {
        next(error);
    }
};


module.exports = {
    adminHome,
};
