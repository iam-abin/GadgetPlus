const categorySchema=require('../models/category');


module.exports={

    addCategoryTooDb:(productData)=>{
        return new Promise(async(resolve,reject)=>{
            let category = await new categorySchema({
                name: productData.categoryName,
                description: productData.categoryDescription,
              });
              await category.save()
              .then(()=>{
                  resolve(category._id);
              }).catch((error)=>{
                reject(error);
              })
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
                resolve(result);
            })
        })
    },


    editCategory:(categoryAfterEdit)=>{
        return new Promise(async(resolve,reject)=>{
            let category=await categorySchema.findById({_id:categoryAfterEdit.categoryId});
            category.name=categoryAfterEdit.categoryName;
            category.description=categoryAfterEdit.categoryDescription;

            await category.save()
            .then((category)=>{
                resolve(category);
            })
            .catch((error)=>{
                reject(error);
            })
        })
    },


    softDeleteAProductCategory: async(categoryId)=>{
        return new Promise(async (resolve,reject)=>{
            let category=await categorySchema.findById({_id:categoryId});
            category.status=!category.status;
            category.save();
            resolve(category);
        })
    }

}