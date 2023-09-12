const userAuthenticationCheck = async (req, res, next) =>{
    try {
        if(req.session.user && req.cookies.user_sid){
            res.status(200).redirect('/user-home')
        } else {
            next()
        }
    } catch (error) {
        res.status(500).redirect('/error')
    }
}


const userChecking = async (req, res, next) =>{
    try {
        if(req.session.user && req.cookies.user_sid){
            next()
        } else {
            res.status(200).redirect('/user-login');
        }
    } catch (error) {
        res.status(500).redirect('/error')
    }
}


const adminAuthenticationChecking=async (req,res,next)=>{
    try{
        if(req.session.admin){
            res.redirect('/admin/admin-home')
        }else{
            next()
        }
    }catch(error){
        res.status(500).redirect('/error')
    }
}


const adminChecking=(req,res,next)=>{
    try {
        if(req.session.admin){
            next()
        }else{
            res.status(200).redirect('/admin')
        }
    } catch (error) {
        res.status(500).redirect('/error')
    }
}


module.exports = {
    userAuthenticationCheck,
    userChecking,
    adminAuthenticationChecking,
    adminChecking
}