
const salesReportPage = async (req, res, next) => {
	try {
		const sales = await orderHelper.getAllDeliveredOrders();
		sales.forEach((order) => {
			order.orderDate = formatDate(order.orderDate);
			order.totalAmount = formatCurrency(order.totalAmount);
		});
		res.render("admin/sales-report", {
			sales,
			layout: ADMIN_LAYOUT,
		});
	} catch (error) {
		next(error);
	}
};


const salesReport = async (req, res, next) => {
	try {
		let { startDate, endDate } = req.body;

		startDate = new Date(startDate);
		endDate = new Date(endDate);

		const salesReport = await orderHelper.getAllDeliveredOrdersByDate(
			startDate,
			endDate
		);
		for (let i = 0; i < salesReport.length; i++) {
			salesReport[i].orderDate = formatDate(salesReport[i].orderDate);
			salesReport[i].totalAmount = currencyFormatWithoutDecimal(
				salesReport[i].totalAmount
			);
		}
		res.status(200).json({ sales: salesReport });
	} catch (error) {
		next(error);
	}
};


module.exports = {
    salesReportPage,
	salesReport,
}