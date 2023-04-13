
const adminLogin=async (req,res)=>{
    res.render("admin/loginAdmin",{layout:'layouts/adminLayout'})
}

const adminLoginPost=async (req,res)=>{
    res.render("admin/index",{layout:'layouts/adminLayout'})
}


const adminLogout=async (req,res)=>{
    res.redirect('/')
}


module.exports={
    adminLogin,
    adminLoginPost,
    adminLogout
}