const userSchema = require("../models/userModel");
const couponSchema = require("../models/couponModel");
const productSchema = require("../models/productModel");

const userHelper = require("../helpers/userHelper");
const productHelper = require("../helpers/productHelper");
const cartHelper = require("../helpers/cartHelper");
const addressHelper = require("../helpers/addressHelper");
const orderHelper = require("../helpers/orderHepler");
const couponHelper = require("../helpers/coupenHelper");
const wishListHelper = require("../helpers/wishListHelper");
const walletHelper = require("../helpers/walletHelper");

const { formatCurrency } = require("../utils/currency-format");
const { formatDate } = require("../utils/date-format");

const twilio = require("../api/twilio");
const razorpay = require("../api/razorpay");

let cartCount;
let wishListCount;




module.exports = {
   
    
};
