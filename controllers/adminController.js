const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelper");
const categoryHelper = require("../helpers/categoryHelper");
const orderHelper = require('../helpers/orderHepler');
const coupenHelper = require('../helpers/coupenHelper');
const orderHepler = require("../helpers/orderHepler");
const walletHelper = require("../helpers/walletHelper");

var easyinvoice = require('easyinvoice');
const csvParser = require('json-2-csv');


const adminLogin = async (req, res, next) => {
  try {
    res.render("admin/adminLogin", {
      layout: "layouts/adminLayout",
      admin: true,
    });
  } catch (error) {
    next(error)
  }
};

const adminLoginPost = async (req, res, next) => {
  const adminName = req.body.name;  //email
  const adminPassword = req.body.password;
  try {
    const adminDetails = await adminHelper.isAdminExists(adminName, adminPassword)
    console.log(adminDetails, "isExist");
    if (adminDetails) {
      req.session.admin = adminDetails;
      res.redirect("/admin");
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    return next(error)
  }
};

const adminHome = async (req, res, next) => {
  try {
    const orderStatus = await orderHelper.getAllOrderStatusesCount();
    const chartData = await adminHelper.getChartDetails();
    const dashboardDetails = await adminHelper.getDashboardDetails();
    dashboardDetails.totalRevenue = currencyFormat(dashboardDetails.totalRevenue)
    dashboardDetails.monthlyRevenue = currencyFormat(dashboardDetails.monthlyRevenue)

    console.log("dashboardDetails", dashboardDetails);
    res.render("admin/admin-home", { orderStatus, chartData, dashboardDetails, layout: "layouts/adminLayout" });
  } catch (error) {
    return next(error)
  }
};

const salesReportPage = async (req, res, next) => {
  try {
    const sales = await orderHelper.getAllDeliveredOrders();
    sales.forEach((order) => {
      order.orderDate = dateFormat(order.orderDate)
    })
    res.render('admin/sales-report', { sales, layout: "layouts/adminLayout" })
  } catch (error) {
    next(error)
  }
}



const salesReport = async (req, res, next) => {
  try {
    let { startDate, endDate } = req.body;

    startDate = new Date(startDate)
    endDate = new Date(endDate)

    const salesReport = await orderHelper.getAllDeliveredOrdersByDate(startDate, endDate);
    for (let i = 0; i < salesReport.length; i++) {
      salesReport[i].orderDate = dateFormat(salesReport[i].orderDate)
      salesReport[i].totalAmount = currencyFormat(salesReport[i].totalAmount)
    }
    res.status(200).json({ sales: salesReport })
  } catch (error) {
    return next(error)
  }
}


const usersList = async (req, res, next) => {
  await adminHelper
    .findUsers()
    .then((response) => {
      res.status(200).render("admin/users-list", {
        layout: "layouts/adminLayout",
        users: response,
      });
    })
    .catch((error) => {
      return next(error);
    });
};

const blockUnBlockUser = async (req, res, next) => {
  const userId = req.params.id;
  await adminHelper
    .blockOrUnBlockUser(userId)
    .then((result) => {
      if (result.isActive) {
        res
          .status(200)
          .json({
            error: false,
            message: "User has been unBlocked",
            user: result,
          });
      } else {
        req.session.user = false;

        res
          .status(200)
          .json({
            error: false,
            message: "User has been Blocked",
            user: result,
          });
      }
    })
    .catch((error) => {
      return next(error);
    });
};

const productList = (req, res, next) => {
  productHelper.getAllProductsWithLookup()
    .then((responseProduct) => {
      for (let i = 0; i < responseProduct.length; i++) {
        responseProduct[i].product_price = currencyFormat(responseProduct[i].product_price)
        responseProduct[i].product_discount = currencyFormat(responseProduct[i].product_discount)
      }

      res.render("admin/products-list", {
        layout: "layouts/adminLayout",
        products: responseProduct,
      });
    })
    .catch((error => {
      return next(error);
    }))
};


const addProduct = async (req, res, next) => {
  categoryHelper.getAllcategory()
    .then((response) => {
      res.render("admin/add-product", {
        layout: "layouts/adminLayout",
        category: response,
      });
    })
    .catch((error) => {
      return next(error);
    })
};

const postAddProduct = (req, res, next) => {
  productHelper.addProductToDb(req.body, req.files)
    .then((response) => {
      res.status(500).redirect("/admin/product");
    })
    .catch((error) => {
      return next(error);
    })
};

const editProduct = async (req, res, next) => {
  try {
    const product = await productHelper.getAProduct(req.params.slug);
    const categories = await categoryHelper.getAllcategory();

    if (product == "") {
      res.status(401).redirect("/admin");
    } else {
      res
        .status(200)
        .render("admin/edit-product", {
          product,
          categories,
          layout: "layouts/adminLayout",
        });
    }
  } catch (error) {
    return next(error);
  }
};

const postEditProduct = (req, res, next) => {
  productHelper
    .postEditAProduct(req.body, req.params.slug, req.file)
    .then((response) => {
      res.status(200).redirect("/admin/product");
    })
    .catch((error) => {
      return next(error);
    })
};

const deleteProduct = (req, res, next) => {
  productHelper.softDeleteProduct(req.params.slug)
    .then((result) => {
      if (result) {
        console.log(result);
        if (result.product_status) {
          res
            .status(200)
            .json({
              error: false,
              message: "product unblocked ",
              product: result,
            });
        } else {
          res
            .status(200)
            .json({ error: false, message: "product deleted", product: result });
        }
      } else {
        res.status(401).json({ error: false, message: "error occurerd" });
      }
    })
    .catch((error) => {
      return next(error);
    })
};

const productCategory = (req, res, next) => {
  categoryHelper.getAllcategory()
    .then((category) => {
      res.render("admin/product-categories", {
        layout: "layouts/adminLayout",
        categories: category,
      });
    })
    .catch((error) => {
      return next(error);
    })
};

const postAddProductCategory = (req, res) => {

  categoryHelper.addCategoryTooDb(req.body)
    .then((category) => {
      res.status(200).redirect("/admin/product-categories");
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(200).json({ error: true, message: "Category already Exist!!!" })
      } else {
        res.status(500).redirect('/error')
      }
    })
};

const editProductCategory = (req, res, next) => {
  categoryHelper.getAcategory(req.params.id)
    .then((response) => {
      res.status(200).json({ category: response });
    })
    .catch((error) => {
      return next(error);
    })
};

const editProductCategoryPost = (req, res) => {
  categoryHelper.editCategory(req.body)
    .then((response) => {
      res.status(202).json({ message: "category updated" })
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(500).json({ error: true, message: "Category already Exist!!!" })
      } else {
        res.status(500).redirect('/error')
      }
    })
}

const deleteProductCategory = (req, res, next) => {
  console.log(req.params.id);
  categoryHelper.softDeleteAProductCategory(req.params.id)
    .then((response) => {
      if (response.status) {
        res.status(200).json({ error: false, message: "category listed", listed: true })
      } else {
        res.status(200).json({ error: false, message: "category unlisted", listed: false })
      }
    })
    .catch((error) => {
      return next(error);
    })
};

const productOrders = async (req, res, next) => {
  try {
    let orders = await orderHelper.getAllOrders();
    for (let i = 0; i < orders.length; i++) {
      orders[i].totalAmount = currencyFormat(orders[i].totalAmount)
      orders[i].orderDate = dateFormat(orders[i].orderDate)
    }
    res.render("admin/orders", { layout: "layouts/adminLayout", orders });
  } catch (error) {
    next(error)
  }
};

const changeProductOrderStatus = async (req, res, next) => {
  try {
    const response = await orderHepler.changeOrderStatus(req.body.orderId, req.body.status);

    if (response.orderStatus == 'returned') {
      await walletHelper.addMoneyToWallet(response.user, response.totalAmount);
      await productHelper.increaseStock(response)
    }
    res.status(202).json({ error: false, message: 'order status updated', status: response.orderStatus })
  } catch (error) {
    return next(error);
  }
};

const productOrderDetails = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    let orderdetails = await orderHelper.getOrderedUserDetailsAndAddress(orderId); //got user details
    let productDetails = await orderHelper.getOrderedProductsDetails(orderId); //got ordered products details

    const userId = productDetails[0].user
    let coupensUsed = coupenHelper.getUserUsedCoupens(userId)

    for (let i = 0; i < orderdetails.length; i++) {
      orderdetails[i].discount = currencyFormat(orderdetails[i].discount)
    }

    for (let i = 0; i < productDetails.length; i++) {
      productDetails[i].orderedProduct.totalPriceOfOrderedProducts = currencyFormat(productDetails[i].orderedProduct.product_price * productDetails[i].orderedItems.quantity);
      productDetails[i].orderedProduct.product_price = currencyFormat(productDetails[i].orderedProduct.product_price);
    }

    orderdetails.totalAmount = currencyFormat(orderdetails.totalAmount)
    res.render('admin/order-details', { orderdetails, productDetails, layout: "layouts/adminLayout" })
  } catch (error) {
    return next(error);
  }
}

const banners = (req, res) => {
  res.render('admin/banner', { layout: "layouts/adminLayout" })
};

const coupons = async (req, res, next) => {
  try {
    let allCoupons = await coupenHelper.getAllCoupons();

    for (let i = 0; i < allCoupons.length; i++) {
      allCoupons[i].discount = currencyFormat(allCoupons[i].discount)
      allCoupons[i].expiryDate = dateFormat(allCoupons[i].expiryDate)
    }
    res.render("admin/coupon", { coupons: allCoupons, layout: "layouts/adminLayout" });
  } catch (error) {
    return next(error);
  }
};

const postAddCoupon = async (req, res, next) => {
  coupenHelper.addCouponToDb(req.body)
    .then((coupon) => {
      res.status(202).redirect('/admin/coupon')
    })
    .catch((error) => {
      return next(error);
    })
}

const editCoupon = async (req, res, next) => {
  try {
    const couponData = await coupenHelper.getACoupenData(req.params.id);
    res.status(200).json({ couponData })
  } catch (error) {
    return next(error);
  }
}

const editCouponPost = (req, res, next) => {
  try {
    const response = coupenHelper.editCoupon(req.body);
    res.redirect('/admin/coupon')
  } catch (error) {
    return next(error);
  }
}

const deleteCoupon = async (req, res, next) => {
  try {
    await coupenHelper.deleteACoupon(req.params.id)
      .then((res) => {
        res.json({ message: "coupon deleted successfully" })
      })
  } catch (error) {
    return next(error)
  }
}



const userProfile = async (req, res, next) => {
  const userOrderDetails = await orderHelper.getAllOrderDetailsOfAUser(req.params.id);
  for (let i = 0; i < userOrderDetails.length; i++) {
    userOrderDetails[i].totalAmount = currencyFormat(userOrderDetails[i].totalAmount)
    userOrderDetails[i].orderDate = dateFormat(userOrderDetails[i].orderDate)
  }
  await adminHelper.findAUser(req.params.id)
    .then((response) => {
      res.render("admin/user-profile", {
        layout: "layouts/adminLayout",
        user: response,
        userOrderDetails
      });
    })
    .catch((error) => {
      return next(error)
    });
};

const adminLogout = (req, res) => {
  req.session.admin = false;
  res.redirect("/admin");
};



function dateFormat(date) {
  return date.toISOString().slice(0, 10)
}

// convert a number to a indian currency format
function currencyFormat(amount) {
  return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
}

function currencyFormatWithFractional(amount) {
  return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
}



module.exports = {
  adminLogin,
  adminLoginPost,
  adminHome,
  salesReportPage,
  salesReport,
  adminLogout,
  usersList,
  blockUnBlockUser,
  productList,
  addProduct,
  postAddProduct,
  editProduct,
  postEditProduct,
  productCategory,
  deleteProduct,
  postAddProductCategory,
  editProductCategory,
  editProductCategoryPost,
  deleteProductCategory,
  productOrders,
  changeProductOrderStatus,
  productOrderDetails,
  banners,
  coupons,
  postAddCoupon,
  editCoupon,
  editCouponPost,
  deleteCoupon,
  userProfile,
  dateFormat
};
