const userSchema = require("../models/userModel");
const adminHelper = require("../helpers/adminHelper");

const email = "admin@gmail.com";
const password = "123";

const adminLogin = async (req, res) => {
  try {
    if (req.session.admin) {
      res.render("admin/admin-home", { layout: "layouts/adminLayout"});
    } else {
      res.render("admin/adminLogin", {
        layout: "layouts/adminLayout",
        admin: true,
      });
    }
  } catch (error) {
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

const usersList = (req, res) => {
  if (req.session.admin) {
    adminHelper.findUsers().then((response) => {
      console.log(response);
      res.render("admin/users-list", {
        layout: "layouts/adminLayout",
        admin: false,
        users: response,
      });
    });
  } else {
    res.redirect("/admin");
  }
};

const productList = (req, res) => {
  res.render("admin/products-list", {
    layout: "layouts/adminLayout",
    admin: false,
  });
};

const addProduct = (req, res) => {
  res.render("admin/add-product", {
    layout: "layouts/adminLayout",
    admin: false,
  });
};

const orders = (req, res) => {
  res.render("admin/orders", { layout: "layouts/adminLayout", admin: false });
};

const banners = (req, res) => {
  res.send("Banner");
};

const coupons = (req, res) => {
  res.send("coupon");
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
  adminLogout,
  usersList,
  productList,
  addProduct,
  orders,
  banners,
  coupons,
  // isLogged
};
