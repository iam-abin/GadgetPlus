const formatCurrency = (amount) => {
	const curr = amount.toLocaleString("en-IN", {
		style: "currency",
		currency: "INR",
	});
	return curr;
};

function currencyFormatWithoutDecimal(amount) {
	return Number(amount).toLocaleString("en-in", {
		style: "currency",
		currency: "INR",
		minimumFractionDigits: 0,
	});
}

module.exports = { formatCurrency, currencyFormatWithoutDecimal };
