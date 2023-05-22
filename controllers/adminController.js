
const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelper");
const categoryHelper = require("../helpers/categoryHelper");
const orderHelper = require('../helpers/orderHepler');
const coupenHelper = require('../helpers/coupenHelper');

// const PDFDocument = require('pdfkit');
// const fs = require('fs');

const { currencyFormat } = require("../controllers/userController");

var easyinvoice = require('easyinvoice');
const slugify = require('slugify');
const csvParser = require('json-2-csv');

const cartHelper = require("../helpers/cartHelper");
const orderHepler = require("../helpers/orderHepler");

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
    const orderStatus = await orderHelper.getAllOrderStatusesCount()

    res.render("admin/admin-home", { orderStatus, layout: "layouts/adminLayout" });
  } catch {
    res.status(500);
  }
};

const salesReport = async (req, res) => {
  try {
    let salesData = [];
    const sales = await orderHelper.getAllOrders();

    sales.forEach(sale => {
      const { _id, orderDate, totalAmount, paymentMethod, orderStatus } = sale
      const userName = sale.userDetails[0].name;
      salesData.push({ _id, userName, orderDate, totalAmount, paymentMethod, orderStatus })
    });

    const csvFields = ["Id", "Name", "Order Date", "Amount", "Payment Method", "Order Status"];
    const csvData = await csvParser.json2csv(salesData, { csvFields })

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment: filename = Sales-Report.csv");
    res.status(200).end(csvData);

  } catch (error) {
    console.log(error);
  }
}

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
      responseProduct[i].product_price = Number(responseProduct[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' ,minimumFractionDigits:0})
      responseProduct[i].product_discount = Number(responseProduct[i].product_discount).toLocaleString('en-in', { style: 'currency', currency: 'INR' ,minimumFractionDigits:0})

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
    let product = await productHelper.getAProduct(req.params.id);
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
    .postEditAProduct(req.body, req.params.id, req.file)
    .then((response) => {
      res.status(200).redirect("/admin/product");
    });
};

const deleteProduct = (req, res) => {
  console.log(req.params.id);
  productHelper.softDeleteProduct(req.params.id).then((result) => {
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
      orders[i].totalAmountInr = orders[i].totalAmount
      // .toLocaleString('en-in', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    }

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
    res.status(202).json(response)
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
    let coupons = await coupenHelper.getAllCoupons();

    console.log(coupons);
    for (let i = 0; i < coupons.length; i++) {
      coupons[i].discount = Number(coupons[i].discount).toLocaleString('en-in', { style: 'currency', currency: 'INR' ,minimumFractionDigits:0})
      
    }
    console.log(coupons);
    res.render("admin/coupon", { coupons, layout: "layouts/adminLayout" });
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

// const isLogged=(req,res,next)=>{
//     if(req.session.admin){
//         next();
//     }else{
//         res.redirect('/admin/adminLogin')
//     }
// }

module.exports = {
  adminLogin,
  adminLoginPost,
  adminHome,
  salesReport,
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
};
