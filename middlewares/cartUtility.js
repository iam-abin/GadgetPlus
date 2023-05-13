// const cartHelper=require('../helpers/cartHelper')

// const cartCountSupply=async(req,res,next)=>{
//     try {
//        if(req.session.user){
//         console.log("middle");
//         const cartCount=cartHelper.getCartCount(req.session.user._id);
//         res.locals.cartCount=cartCount;
//         next()
//        }else{
//         next()
//        }
//     } catch (error) {
//         next()
//         console.log(error);
//         res.status(500).redirect('/error')
        
//     }
// }

// module.exports=cartCountSupply;