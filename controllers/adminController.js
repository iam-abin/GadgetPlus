
const adminHome=async (req,res)=>{
    res.send("admin Home Page")
}

const adminLogin=async (req,res)=>{
    res.send("admin Login Page")
}

module.exports={
    adminHome,
    adminLogin
}