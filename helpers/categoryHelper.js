const categorySchema=require('../models/category');


module.exports={
    addCategoryTooDb:(productData)=>{
        return new Promise(async(resolve,reject)=>{
            let category = await new categorySchema({
                name: productData.categoryName,
                description: productData.categoryDescription,
              });
              await category.save();
              resolve(category._id);
        })
    },

    getAllcategory:()=>{
        return new Promise(async (resolve, reject) => {
            let category = await categorySchema.find();
            resolve(category);
          });
    }
}