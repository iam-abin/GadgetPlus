const walletHelper = require("../../helpers/walletHelper");
const { formatCurrency } = require("../../utils/currency-format");

const getWallet = async (req, res, next) => {
    try {
        let userId = req.session.user._id;
        let walletBalance = await walletHelper.walletBalance(userId);
        walletDetails = formatCurrency(walletBalance);
        res.json({ walletDetails });
    } catch (error) {
        next(error);
    }
};



module.exports = {
    getWallet
}