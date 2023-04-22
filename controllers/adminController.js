const userSchema = require("../models/userModel");
const adminHelper = require("../helpers/adminHelper");
const productHelper=require("../helpers/productHelper")

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
    res.status(200).render("admin/users-list", {
      layout: "layouts/adminLayout",
      // admin: false,
      users: response,
    });
  }).catch((error) => {
    console.log("errorrrrrrrrrrrrrrrr");
    console.log(error);
  });

};

const blockUnBlockUser = async (req, res) => {
  let userId = req.params.id;
  await adminHelper.blockOrUnBlockUser(userId)
    .then((result) => {
      // console.log(result);
      // res.redirect("/admin/users-List")
      res.status(200).json({error: false, message:'User has been blocked', user: result})
    }).catch((error) => {
      res.status(200).json({error: true, message:'Something went wrong', user: result})
      console.log(error);
    })
}

// const unBlockUser = async (req, res) => {
//   let userId = req.params.id;
//   await adminHelper.unBlockUser(userId)
//     .then((result) => {
//       res.redirect("/admin/users-List")
//     }).catch((error) => {
//       console.log(error);
//     })
// }

const productList = (req, res) => {
  productHelper.getAllProducts()
  .then((response)=>{
    console.log(response);
    res.render("admin/products-list", {
      layout: "layouts/adminLayout",
      products:response,
    });
  })
  
};

const addProduct = (req, res) => {
  res.render("admin/add-product", {
    layout: "layouts/adminLayout",
    // admin: false,
  });
};

const postAddProduct=(req, res) => {
  console.log(req.body);
  productHelper.addProductToDb(req.body)
  .then((response)=>{
    res.status(500).redirect('/admin/product')
  })
};


const productCategory = (req, res) => {
  adminHelper.getAllcategory().then((category) => {
    console.log(category);
    res.render("admin/product-categories", {
      layout: "layouts/adminLayout",
      categories:category
      // admin: false,
    });
  });

  
};

// const addProductCategory = (req, res) => {
//   res.render("admin/add-product-category", {
//     admin: true,
//   });
// };


const postAddProductCategory=(req, res) => {
  adminHelper
    .addCategoryTooDb(req.body)
    .then((category) => {
      res.status(200).redirect("/admin/product-categories");
    })
    .catch((err) => {
      console.log(err);
    });
};



const orders = (req, res) => {
  res.render("admin/orders", { layout: "layouts/adminLayout" });
};

const banners = (req, res) => {
  res.send("Banner");
};

const coupons = (req, res) => {
  res.render("admin/coupon", { layout: "layouts/adminLayout" });
};

const userProfile = (req, res) => {

  adminHelper.findAUser(req.params.id)
    .then((response) => {
      res.render("admin/user-profile", {
        layout: "layouts/adminLayout",
        user: response
      });
    }).catch((error)=>{
      console.log(error);
    })

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
  blockUnBlockUser,
  // unBlockUser,
  productList,
  addProduct,
  postAddProduct,
  productCategory,
  // addProductCategory,
  postAddProductCategory,
  orders,
  banners,
  coupons,
  userProfile,
  // isLogged
};
