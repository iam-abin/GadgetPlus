
const adminLogin=async (req,res)=>{
    res.render("admin/loginAdmin",{layout:'layouts/adminLayout'})
}

const adminHome=async (req,res)=>{
    res.render("admin/index",{layout:'layouts/adminLayout'})
}



module.exports={
    adminHome,
    adminLogin
}