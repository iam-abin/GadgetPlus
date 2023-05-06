const categorySchema=require('../models/category');


module.exports={
    addCategoryTooDb:(productData)=>{
        return new Promise(async(resolve,reject)=>{
            console.log("hi");
            let category = await new categorySchema({
                name: productData.categoryName,
                description: productData.categoryDescription,
              });
              console.log("hello1");
              await category.save();
              console.log("hello");
              resolve(category._id);
        })
    },

    getAllcategory:()=>{
        return new Promise(async (resolve, reject) => {
           await categorySchema.find()
           .then((result)=>{
               resolve(result);
           })
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
            // console.log(category._id == categoryId);
            // console.log("lllllllllllllllllllllllllllllllllll");
            category.status=!category.status;
            category.save()
            resolve(category)
        })
    }
}