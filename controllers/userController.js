const userModel=require('../models/userModel');
const user=require('../models/userModel')

// const userHome=async (req,res)=>{
//     res.render('user/login',{loginForm:true})
// }

const userHome=async (req,res)=>{
    res.render('user/index-8',{loginForm:false})
}

const userSignup=async (req,res)=>{
    res.render('user/user-signup')
}

const userSignupPost=async (req,res)=>{
    const data=req.body;
    user.create({
        name:data.name,
        email:data.email,
        phone:data.phone,
        password:data.password
    }).then((data)=>{
        console.log(data);
    }).catch((err)=>{
        console.log(err);
    })

    res.redirect('/user-login')
}

const userLogin=async (req,res)=>{

    res.render('user/login')
}

const userLoginPost=async (req,res)=>{
    let email=req.body.email;

    let userData= await user.findOne({email:email})
    console.log(userData);
    console.log(req.body.password);
    if(userData.password==req.body.password){
        res.redirect('/')
    }else{
        res.render('user/404')
    }

    
}

const profile=async (req,res)=>{
    res.render('user/profile')
}

    
const about=async (req,res)=>{
    res.render('user/about')
}

const laptop=async (req,res)=>{
    res.render('user/laptop')
}

const mobile=async (req,res)=>{
    res.render('user/mobile')
}

const wishlist=async (req,res)=>{
    res.render('user/wishlist')
}

const cart=async (req,res)=>{
    res.render('user/cart')
}

const addAddress=async (req,res)=>{
    res.render('user/mobile')
}

const editAddress=async (req,res)=>{
    res.render('user/mobile')
}

const payment=async (req,res)=>{
    res.render('user/mobile')
}

const orderDetails=async (req,res)=>{
    res.render('user/mobile')
}

const product=async (req,res)=>{
    res.render('user/product')
}

const orderSummary=async (req,res)=>{
    res.render('user/mobile')
}

const contact=async (req,res)=>{
    res.render('user/mobile')
}


module.exports={
    userHome,
    profile,
    userSignup,
    userSignupPost,
    userLogin,
    userLoginPost,
    about,
    laptop,
    mobile,
    wishlist,
    cart,
    addAddress,
    editAddress,
    payment,
    orderDetails,
    orderSummary,
    contact,
    product

}