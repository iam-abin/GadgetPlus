const email="admin@gmail.com"
const password="123"


const adminLogin=async (req,res)=>{
    try{
        if(req.session.admin){
            res.render("admin/admin-home",{layout:'layouts/adminLayout'})
        }else{
            res.render('admin/adminLogin',{layout:'layouts/adminLayout',admin:true})
        }
   }catch(error){
        console.log(error);
   }
}

const adminLoginPost=async (req,res)=>{
    if(req.body.email===email && req.body.password===password){
        req.session.admin=true;
        res.redirect('/admin')
        
    }else{
        res.redirect('/admin')
    }
    
}


const adminLogout=async (req,res)=>{
     req.session.admin=false;
    res.redirect('/admin')
}


module.exports={
    adminLogin,
    adminLoginPost,
    adminLogout
}