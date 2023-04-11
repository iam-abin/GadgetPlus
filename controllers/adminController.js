
const adminHome=async (req,res)=>{
    res.render("admin/loginAdmin",{layout:'layouts/adminLayout'})
}

const adminLogin=async (req,res)=>{
    res.send("admin Login Page")
}

module.exports={
    adminHome,
    adminLogin
}