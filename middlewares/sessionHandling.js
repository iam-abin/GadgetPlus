export function authenticationCheck(req,res,next){
    try{

        if(req.session.user){
            res.redirect('/');
        }else{
            next()
        }

    }catch(err){
        res.status(500).redirect("/404");
    }
}