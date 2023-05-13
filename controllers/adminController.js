// const userSchema = require("../models/userModel");
const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelper");
const categoryHelper = require("../helpers/categoryHelper");
const orderHelper = require('../helpers/orderHepler')

const { currencyFormat } = require("../controllers/userController");

const slug = require('slugify')
// const productSchema=require('../models/productModel');
// const categorySchema=require('../models/category');

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
  if (req.body.email === email && req.body.password === password) {
    req.session.admin = true;
    res.redirect("/admin");
  } else {
    res.redirect("/admin");
  }
};

const adminHome = (req, res) => {
  try {
    res.render("admin/admin-home", { layout: "layouts/adminLayout" });
  } catch {
    res.status(500);
  }
};

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
      responseProduct[i].product_price = Number(responseProduct[i].product_price).toLocaleString('en-in', { style: 'currency', currency: 'INR' })
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
      res.status(500).json({ error: true, message: "Category already Exist!!!" })
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
  try {
    console.log("===========================");
    console.log(req.body);
    categoryHelper.editCategory(req.body)
      .then((response) => {
        res.status(202).json({ message: "category updated" })
      })

  } catch (error) {
    console.log(error);
  }

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
      orders[i].totalAmountInr = orders[i].totalAmount.toLocaleString('en-in', { style: 'currency', currency: 'INR' ,maximumFractionDigits:0})
    }

    res.render("admin/orders", { layout: "layouts/adminLayout", orders });
  } catch (error) {
    console.log(error);
  }
};

const productOrderDetails = async (req,res) => {
  try {
    console.log(req.params);
    const orderId=req.params.id;
    let orderedUserdetails=await orderHelper.getOrderedUserDetailsAddress(orderId); //got user details
    let productDetails=orderHelper.getOrderedProductsDetails(orderId);
    res.render('admin/order-details.ejs',{orderedUserdetails , layout: "layouts/adminLayout" })
  } catch (error) {
    console.log(error);
  }
}

const banners = (req, res) => {
  res.render('admin/banner', { layout: "layouts/adminLayout" })
};

const coupons = (req, res) => {
  res.render("admin/coupon", { layout: "layouts/adminLayout" });
};

const userProfile = (req, res) => {
  adminHelper
    .findAUser(req.params.id)
    .then((response) => {
      res.render("admin/user-profile", {
        layout: "layouts/adminLayout",
        user: response,
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
  adminLogout,
  usersList,
  blockUnBlockUser,
  // unBlockUser,
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
  productOrderDetails,
  banners,
  coupons,
  userProfile,
  // isLogged
};
