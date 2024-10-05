const walletHelper = require("../../helpers/walletHelper");
const { formatCurrency } = require("../../utils/currency-format");

const getWallet = async (req, res, next) => {
    try {
        const userId = req.session.user._id;
        const walletBalance = await walletHelper.walletBalance(userId);
        const walletDetails = formatCurrency(walletBalance);
        res.status(200).json({ walletDetails });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getWallet,
};
