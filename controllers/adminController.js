
const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelper");
const categoryHelper = require("../helpers/categoryHelper");
const orderHelper = require('../helpers/orderHepler');
const coupenHelper = require('../helpers/coupenHelper');

// const PDFDocument = require('pdfkit');
// const fs = require('fs');

var easyinvoice = require('easyinvoice');
// const slugify = require('slugify');
const csvParser = require('json-2-csv');

const orderHepler = require("../helpers/orderHepler");
const walletHelper = require("../helpers/walletHelper");

const email = "admin@gmail.com";
const password = "123";

const adminLogin = async (req, res) => {
  try {
    res.render("admin/adminLogin", {
      layout: "layouts/adminLayout",
      admin: true,
    });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};

const adminLoginPost = async (req, res) => {
  try {
    if (req.body.email === email && req.body.password === password) {
      req.session.admin = true;
      res.redirect("/admin");
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error);
  }
};

const adminHome = async (req, res) => {
  try {
    const orderStatus = await orderHelper.getAllOrderStatusesCount();
    const chartData=await adminHelper.getChartDetails();
    const dashboardDetails = await adminHelper.getDashboardDetails();
    dashboardDetails.totalRevenue=currencyFormat(dashboardDetails.totalRevenue)
    dashboardDetails.monthlyRevenue=currencyFormat(dashboardDetails.monthlyRevenue)

    console.log("dashboardDetails",dashboardDetails);
    res.render("admin/admin-home", { orderStatus, chartData, dashboardDetails, layout: "layouts/adminLayout" });
  } catch {
    res.status(500);
  }
};

//--------------------------------------------------------------------------------------
const salesReportPage=async (req,res)=>{
  const sales = await orderHelper.getAllDeliveredOrders();
  console.log("sales",sales);
  sales.forEach((order)=>{
    order.orderDate=dateFormat(order.orderDate)
    // order.totalAmount=dateFormat(order.totalAmount)
  })
  res.render('admin/sales-report',{sales, layout: "layouts/adminLayout" })
}



const salesReport = async (req, res) => {
  try {
    let {startDate,endDate}=req.body;

    startDate=new Date(startDate)
    endDate=new Date(endDate)

    const salesReport = await orderHelper.getAllDeliveredOrdersByDate(startDate,endDate);
    for(let i=0;i<salesReport.length;i++){
      salesReport[i].orderDate=dateFormat(salesReport[i].orderDate)
      salesReport[i].totalAmount=currencyFormat(salesReport[i].totalAmount)
    }
    res.status(200).json({sales:salesReport})
  } catch (error) {
    console.log(error);
  }
}



// const salesReportExcel = async (req, res) => {
//   try {
//     console.log("salesReportExcelsalesReportExcel",req.body,"salesReportExcelsalesReportExcel");
//     let salesData = [];
//     let {startDate,endDate}=req.body;

//     startDate=new Date(startDate)
//     endDate=new Date(endDate)

//     const salesReport = await orderHelper.getAllDeliveredOrdersByDate(startDate,endDate);

//     for(let i=0;i<salesReport.length;i++){
//       salesReport[i].orderDate=dateFormat(salesReport[i].orderDate)
//       salesReport[i].totalAmount=currencyFormat(salesReport[i].totalAmount)
//     }

//     console.log(salesReport);
//     sales.forEach(sale => {
//       const { _id, orderDate, totalAmount, paymentMethod, orderStatus } = sale
//       const userName = sale.userDetails[0].name;
//       salesData.push({ _id, userName, orderDate, totalAmount, paymentMethod, orderStatus })
//     });

//     const csvFields = ["No", "Order Id", "Customer Id", "Order Date", "Payment Method", "Order Status", "Total Amount"];
//     const csvData = await csvParser.json2csv(salesData, { csvFields })

//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", "attachment: filename = Sales-Report.csv");
//     res.status(200).end(csvData);

//   } catch (error) {
//     console.log(error);
//   }
// }

//--------------------------------------------------------------------------------------


// const salesReportPdf=async (req,res)=>{
//   try {
//     const sales= await orderHelper.getAllOrders();

//     function createInvoice(invoice, path) {
//       let doc = new PDFDocument({ margin: 50 });

//       // generateHeader(doc); // Invoke `generateHeader` function.
//       generateFooter(doc); // Invoke `generateFooter` function.


//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
//       doc.pipe(res);
//       doc.end();

//     }

//     // function generateHeader(doc) {
//     //   doc.image('../../public/user/assets/images/logo.png', 50, 45, { width: 50 })
//     //     .fillColor('#444444')
//     //     .fontSize(20)
//     //     .text('ACME Inc.', 110, 57)
//     //     .fontSize(10)
//     //     .text('123 Main Street', 200, 65, { align: 'right' })
//     //     .text('New York, NY, 10025', 200, 80, { align: 'right' })
//     //     .moveDown();
//     // }

//     function generateFooter(doc) {
//       doc.fontSize(
//         10,
//       ).text(
//         'Payment is due within 15 days. Thank you for your business.',
//         50,
//         780,
//         { align: 'center', width: 500 },
//       );
//     }

//     const invoice = {
//       shipping: {
//         name: 'John Doe',
//         address: '1234 Main Street',
//         city: 'San Francisco',
//         state: 'CA',
//         country: 'US',
//         postal_code: 94111,
//       },
//       items: [
//         {
//           item: 'TC 100',
//           description: 'Toner Cartridge',
//           quantity: 2,
//           amount: 6000,
//         },
//         {
//           item: 'USB_EXT',
//           description: 'USB Cable Extender',
//           quantity: 1,
//           amount: 2000,
//         },
//       ],
//       subtotal: 8000,
//       paid: 0,
//       invoice_nr: 1234,
//     };

//     // createInvoice(invoice, 'invoice.pdf');


//     console.log("hello");
//     res.redirect('/admin')

//   } catch (error) {
//     console.log(error);
//   }
// }

const usersList = async (req, res) => {
  await adminHelper
    .findUsers()
    .then((response) => {
      // console.log(response);
      res.status(200).render("admin/users-list", {
        layout: "layouts/adminLayout",
        // admin: false,
        users: response,
      });
    })
    .catch((error) => {
      console.log("errorrrrrrrrrrrrrrrr");
      console.log(error);
    });
};

const blockUnBlockUser = async (req, res) => {
  let userId = req.params.id;
  await adminHelper
    .blockOrUnBlockUser(userId)
    .then((result) => {
      // console.log(result);
      // res.redirect("/admin/users-List")
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
      res
        .status(200)
        .json({ error: true, message: "Something went wrong", user: result });
      console.log(error);
    });
};

// const unBlockUser = async (req, res) => {
//   let userId = req.params.id;
//   await adminHelper.unBlockUser(userId)
//     .then((result) => {
//       res.redirect("/admin/users-List")
//     }).catch((error) => {
//       console.log(error);
//     })
// }

//--------------------------------------------------------------------------------

const productList = (req, res) => {
  productHelper.getAllProductsWithLookup().then((responseProduct) => {
    console.log("products", responseProduct);
    // console.log("category", responseCategory);

    for (let i = 0; i < responseProduct.length; i++) {
      responseProduct[i].product_price = Number(responseProduct[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
      responseProduct[i].product_discount = Number(responseProduct[i].product_discount).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })

    }

    res.render("admin/products-list", {
      layout: "layouts/adminLayout",
      products: responseProduct,
    });
  });
};



//--------------------------------------------------------------------------------

const addProduct = async (req, res) => {
  categoryHelper.getAllcategory().then((response) => {
    res.render("admin/add-product", {
      layout: "layouts/adminLayout",
      category: response,
      // admin: false,
    });
  });
};

const postAddProduct = (req, res) => {
  // console.log(req.body);
  // console.log("hi");
  // console.log(req.files);
  // console.log("hi");

  productHelper.addProductToDb(req.body, req.files).then((response) => {
    res.status(500).redirect("/admin/product");
  });
};

const editProduct = async (req, res) => {
  try {
    let product = await productHelper.getAProduct(req.params.slug);
    // let category=await categoryHelper.getAcategory()
    let categories = await categoryHelper.getAllcategory();

    console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");
    console.log(product);
    console.log("''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''");
    console.log(categories);
    console.log("::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::");

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
    console.log(error);
  }
};

const postEditProduct = (req, res) => {
  console.log("new image");
  console.log(req.file);
  productHelper
    .postEditAProduct(req.body, req.params.slug, req.file)
    .then((response) => {
      res.status(200).redirect("/admin/product");
    });
};

const deleteProduct = (req, res) => {
  console.log(req.params.slug);
  productHelper.softDeleteProduct(req.params.slug).then((result) => {
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
  });
};

// ----------------------------------------------

const productCategory = (req, res) => {
  categoryHelper.getAllcategory().then((category) => {
    // console.log(category);
    res.render("admin/product-categories", {
      layout: "layouts/adminLayout",
      categories: category,
    });
  });
};

const postAddProductCategory = (req, res) => {
  categoryHelper.addCategoryTooDb(req.body)
    .then((category) => {
      res.status(200).redirect("/admin/product-categories");
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.status(500).json({ error: true, message: "Category already Exist!!!" })
      } else {
        res.status(500).redirect('/error')
      }

    })

};

const editProductCategory = (req, res) => {
  console.log("----------------------------");
  console.log(req.params);
  categoryHelper.getAcategory(req.params.id).then((response) => {
    // console.log("response---",response,"ooooooo");
    res.status(200).json({ category: response });
  });
};

const editProductCategoryPost = (req, res) => {
  console.log("===========================");
  console.log(req.body);
  // let categoryData=JSON.parse(req.body)
  // console.log(categoryData)
  console.log(typeof req.body.categoryName);
  console.log(typeof req.body.categoryDescription);
  categoryHelper.editCategory(req.body)
    .then((response) => {
      res.status(202).json({ message: "category updated" })
    })
    .catch((error) => {
      console.log("abiiiiiiiiiiiiiiiiiiiiiii");
      if (error.code === 11000) {
        res.status(500).json({ error: true, message: "Category already Exist!!!" })
      } else {
        res.status(500).redirect('/error')
      }
    })

}

const deleteProductCategory = (req, res) => {
  console.log(req.params.id);
  categoryHelper.softDeleteAProductCategory(req.params.id)
    .then((response) => {
      if (response.status) {
        res.status(200).json({ error: false, message: "category listed", listed: true })
      } else {
        res.status(200).json({ error: false, message: "category unlisted", listed: false })
      }

    });
};

// ----------------------------------------------


const productOrders = async (req, res) => {
  try {
    let orders = await orderHelper.getAllOrders();

    for (let i = 0; i < orders.length; i++) {
     
      orders[i].totalAmount =  currencyFormat(orders[i].totalAmount)
      orders[i].orderDate = dateFormat(orders[i].orderDate)
    }

    // console.log(orders, "hi");
    res.render("admin/orders", { layout: "layouts/adminLayout", orders });
  } catch (error) {
    console.log(error);
  }
};

const changeProductOrderStatus = async (req, res) => {
  try {
    console.log("Hello");
    // console.log(req.body.status);
    // console.log(req.body.orderId);
    
    const response = await orderHepler.changeOrderStatus(req.body.orderId, req.body.status);
    console.log("orderstatus output",response);
    
    if(response.orderStatus== 'returned'){
      console.log(typeof response.totalAmount);
      await walletHelper.addMoneyToWallet(response.user,response.totalAmount);
      await productHelper.increaseStock(response)
    }
    
    res.status(202).json({ error: false, message: 'order status updated' ,status:response.orderStatus})
  } catch (error) {
    console.log(error);
  }
};

const productOrderDetails = async (req, res) => {
  try {
    console.log(req.params);
    
    const orderId = req.params.id;
    let orderdetails = await orderHelper.getOrderedUserDetailsAndAddress(orderId); //got user details
    // let orderDetails= await orderHelper.getOrderDetails(orderId)
    let productDetails = await orderHelper.getOrderedProductsDetails(orderId); //got ordered products details

    const userId=productDetails[0].user
    let coupensUsed = coupenHelper.getUserUsedCoupens(userId)

    for (let i = 0; i < orderdetails.length; i++) {
      orderdetails[i].discount = currencyFormat(orderdetails[i].discount)
    }

    for (let i = 0; i < productDetails.length; i++) {
      productDetails[i].orderedProduct.totalPriceOfOrderedProducts = currencyFormat(productDetails[i].orderedProduct.product_price*productDetails[i].orderedItems.quantity);
      productDetails[i].orderedProduct.product_price = currencyFormat(productDetails[i].orderedProduct.product_price);
    }

    orderdetails.totalAmount=currencyFormat(orderdetails.totalAmount)
    console.log("productDetails");
    console.log(productDetails);
    console.log("productDetails");
    res.render('admin/order-details', { orderdetails, productDetails, layout: "layouts/adminLayout" })
  } catch (error) {
    console.log(error);
  }
}

const banners = (req, res) => {
  res.render('admin/banner', { layout: "layouts/adminLayout" })
};

const coupons = async (req, res) => {
  try {
    let allCoupons = await coupenHelper.getAllCoupons();
    // console.log("coupons,coupons", allCoupons);

    for (let i = 0; i < allCoupons.length; i++) {
      allCoupons[i].discount = currencyFormat(allCoupons[i].discount)

      allCoupons[i].expiryDate = dateFormat(allCoupons[i].expiryDate)
    }

    // console.log("hi", allCoupons, "hi");
    res.render("admin/coupon", { coupons: allCoupons, layout: "layouts/adminLayout" });

  } catch (error) {
    console.log(error);
  }
};

const postAddCoupon = async (req, res) => {
  console.log("hello");
  coupenHelper.addCouponToDb(req.body)
    .then((coupon) => {
      res.status(202).redirect('/admin/coupon')
    })
}

const editCoupon = async (req, res) => {
  try {
    const couponData = await coupenHelper.getACoupenData(req.params.id);
    res.status(200).json({ couponData })
  } catch (error) {
    console.log(error);
  }
}

const editCouponPost = (req, res) => {
  try {
    console.log("heloooooooooooooooooo");
    console.log(req.body);
    const response = coupenHelper.editCoupon(req.body);
    // res.status(202).json({message:"coupon details updated"})
    res.redirect('/admin/coupon')
  } catch (error) {
    console.log(error);
  }
}

const deleteCoupon = async (req, res) => {
  try {

    // console.log(req.params.id);
    // console.log("helooooooooooooooooooooooooooooooo");
    const response = await coupenHelper.deleteACoupon(req.params.id);
    res.json({ message: "coupon deleted successfully" })

  } catch (error) {
    console.log(error);
  }
}

const userProfile = async (req, res) => {
  const userOrderDetails = await orderHelper.getAllOrderDetailsOfAUser(req.params.id);
  for(let i=0;i<userOrderDetails.length;i++){
    userOrderDetails[i].totalAmount=currencyFormat(userOrderDetails[i].totalAmount)
    userOrderDetails[i].orderDate=dateFormat(userOrderDetails[i].orderDate)
  }
  adminHelper.findAUser(req.params.id).then((response) => {

    res.render("admin/user-profile", {
      layout: "layouts/adminLayout",
      user: response,
      userOrderDetails
    });
  })
    .catch((error) => {
      console.log(error);
    });
};

const adminLogout = (req, res) => {
  req.session.admin = false;
  res.redirect("/admin");
};

function dateFormat(date){
  return date.toISOString().slice(0, 10)
}


// convert a number to a indian currency format
function currencyFormat(amount){
  return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
}

function currencyFormatWithFractional(amount){
  return Number(amount).toLocaleString('en-in', { style: 'currency', currency: 'INR'})
}

module.exports = {
  adminLogin,
  adminLoginPost,
  adminHome,
  salesReportPage,
  salesReport,
  // salesReportExcel,
  // salesReportPdf,
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
  // addProductCategory,
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
  // isLogged

  dateFormat
};
