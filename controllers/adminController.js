const userSchema = require("../models/userModel");
const adminHelper = require("../helpers/adminHelper");

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

const usersList = (req, res) => {
  
    adminHelper.findUsers().then((response) => {
      console.log(response);
      res.render("admin/users-list", {
        layout: "layouts/adminLayout",
        // admin: false,
        users: response,
      });
    }).catch((error)=>{
      console.log("errorrrrrrrrrrrrrrrr");
      console.log(error);
    });
  
};

const blockUser=async (req,res)=>{
  let userId=req.params.id;
  await adminHelper.blockUser(userId)
  .then((result)=>{
    res.redirect("/admin/users-List")
  }).catch((error)=>{
    console.log(error);
  })
}

const unBlockUser=async(req,res)=>{
  let userId=req.params.id;
  await adminHelper.unBlockUser(userId)
  .then((result)=>{
    res.redirect("/admin/users-List")
  }).catch((error)=>{
    console.log(error);
  })
}

const productList = (req, res) => {
  res.render("admin/products-list", {
    layout: "layouts/adminLayout",
    // admin: false,

  });
};

const addProduct = (req, res) => {
  res.render("admin/add-product", {
    layout: "layouts/adminLayout",
    // admin: false,
  });
};

const productCategory = (req, res) => {
  res.render("admin/product-categories", {
    layout: "layouts/adminLayout",
    // admin: false,
  });
};

const orders = (req, res) => {
  res.render("admin/orders", { layout: "layouts/adminLayout"});
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
  blockUser,
  unBlockUser,
  productList,
  addProduct,
  productCategory,
  orders,
  banners,
  coupons,
  // isLogged
};
