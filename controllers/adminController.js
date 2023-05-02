// const userSchema = require("../models/userModel");
const adminHelper = require("../helpers/adminHelper");
const productHelper = require("../helpers/productHelper");
const categoryHelper = require('../helpers/categoryHelper')
const {loginStatus}=require('../controllers/userController')
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

const adminHome=(req,res)=>{
  try{
    res.render("admin/admin-home", { layout: "layouts/adminLayout"});
  }catch{
    res.status(500)
  }
}

const usersList = async (req, res) => {

  await adminHelper.findUsers().then((response) => {
    // console.log(response);
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
      if (result.isActive) {
        res.status(200).json({ error: false, message: 'User has been unBlocked', user: result })
      } else {
        req.session.user=false;
        res.status(200).json({ error: false, message: 'User has been Blocked', user: result })
      }
    }).catch((error) => {
      res.status(200).json({ error: true, message: 'Something went wrong', user: result })
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

//--------------------------------------------------------------------------------

const productList = (req, res) => {
  productHelper.getAllProductsWithLookup()
    .then((responseProduct) => {
      // console.log("products", responseProduct);
      // console.log("category", responseCategory);

      res.render("admin/products-list", {
        layout: "layouts/adminLayout",
        products: responseProduct,

      })
    })

};

// const productList = async (req, res) => {
//   const products = await productSchema.find();
//   const categories = await categorySchema.find();

//   console.log(products);
//   console.log("--------------------");
//   res.render("admin/products-list", {
//     layout: "layouts/adminLayout",
//     products: products,
//     category: categories,
//   });

// }

//--------------------------------------------------------------------------------


const addProduct = async (req, res) => {
  categoryHelper.getAllcategory().then((response) => {
    res.render("admin/add-product", {
      layout: "layouts/adminLayout",
      category: response,
      // admin: false,
    });
  })

};

const postAddProduct = (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  productHelper.addProductToDb(req.body, req.file)
    .then((response) => {
      res.status(500).redirect('/admin/product')
    })
};

const editProduct = async (req, res) => {

  // let category=await categoryHelper.getAcategory()
  productHelper.editAProduct(req.params.id)
    .then((response) => {
      if (response == '') {
        res.status(401).redirect('/admin')
      } else {
        res.status(200).render('admin/edit-product', { product: response, layout: 'layouts/adminLayout' })
      }
    })
    .catch((error) => {
      console.log(error);
    })
}

const postEditProduct = (req, res) => {
  console.log("new image");
  console.log(req.file);
  productHelper.postEditAProduct(req.body, req.params.id, req.file)
    .then((response) => {
      res.status(200).redirect('/admin/product')
    })
}

const deleteProduct = (req, res) => {
  console.log(req.params.id);
  productHelper.softDeleteProduct(req.params.id).
    then((result) => {
      if (result) {
        console.log(result);
        if (result.product_status) {
          res.status(200).json({ error: false, message: "product unblocked ", product: result })
        } else {
          res.status(200).json({ error: false, message: "product deleted", product: result })
        }
      } else {
        res.status(401).json({ error: false, message: "error occurerd" })
      }
    })
}

const productCategory = (req, res) => {
  categoryHelper.getAllcategory().then((category) => {
    // console.log(category);
    res.render("admin/product-categories", {
      layout: "layouts/adminLayout",
      categories: category
      // admin: false,
    });
  });
};

// const addProductCategory = (req, res) => {
//   res.render("admin/add-product-category", {
//     admin: true,
//   });
// };


const postAddProductCategory = (req, res) => {
  categoryHelper
    .addCategoryTooDb(req.body)
    .then((category) => {
      res.status(200).redirect("/admin/product-categories");
    })
    .catch((err) => {
      console.log(err);
    });
};


const editProductCategory=(req,res)=>{
  categoryHelper.getAcategory(req.params.id)
  .then((response)=>{
    // console.log("response---",response,"ooooooo");
    res.status(200).json({category:response})

  })
}

const deleteProductCategory=(req,res)=>{
  categoryHelper.softDeleteAProductCategory(req.params._id)
  .then((response)=>{
    resolve(response)
  })
}


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
    }).catch((error) => {
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
  deleteProductCategory,
  orders,
  banners,
  coupons,
  userProfile,
  // isLogged
};
