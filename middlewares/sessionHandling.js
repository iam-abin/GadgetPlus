

const userAuthenticationCheck = async (req, res, next) =>{
    try {
        if(req.session.user){
            next()
        } else {
            res.status(200).redirect('/landing-page')
        }
    } catch (error) {
        res.status(500).send({message: "Inernal error occured"})
    }
}


const userChecking = async (req, res, next ) =>{
    try {
        if(req.session.user){
            next()
        } else {
            res.status(200).redirect('/landing-page')
        }
    } catch (error) {
        res.status(500).send({message: "Inernal error occured"})
    }
}

const adminAuthenticationChecking=async (req,res,next)=>{
    try{
        if(req.session.admin){
            res.render("admin/admin-home", { layout: "layouts/adminLayout"});
        }else{
            next()
        }
    }catch(error){
        res.status(500).send("Inernal error occured")
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
        res.status(500).send("Inernal error occured")
    }
}

module.exports = {
    userAuthenticationCheck,
    userChecking,
    adminAuthenticationChecking,
    adminChecking
}