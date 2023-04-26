const multer=require('multer');


const productStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/product-images');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"-"+file.originalname);
    }
});

const productUpload=multer({
    storage:productStorage
}).single("img")


module.exports={
    productUpload
}