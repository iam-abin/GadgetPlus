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
    },

    getAcategory:async (categoryId)=>{
        return new Promise(async (resolve,reject)=>{
            await categorySchema.findById({_id:categoryId})
            .then((result)=>{
                resolve(result)
            })
        })
    },

    softDeleteAProductCategory: async(categoryId)=>{
        return new Promise(async (resolve,reject)=>{
            let category=await categorySchema.findById({_id:categoryId});
            category.status=!category.status;
            category.save()
            resolve(category)
        })
    }
}