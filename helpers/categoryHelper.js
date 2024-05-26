const categoryModel = require("../models/category");

module.exports = {
	addCategoryTooDb: async (productData) => {
		try {
            let category = new categoryModel({
                name: productData.categoryName,
                description: productData.categoryDescription,
            });
            await category.save();

            return category._id;
		} catch (error) {
			throw error;
		}
	},

	getAllcategory: async () => {
		try {
			const categories = await categoryModel.find();
			return categories;
		} catch (error) {
			throw error;
		}
	},

	getAcategory: async (categoryId) => {
		try {
			const category = await categoryModel.findById(categoryId);
			return category;
		} catch (error) {
			throw error;
		}
	},

	editCategory: async (categoryAfterEdit) => {
		try {
			let category = await categoryModel.findById(
				categoryAfterEdit.categoryId
			);
			category.name = categoryAfterEdit.categoryName;
			category.description = categoryAfterEdit.categoryDescription;

			const editedCategory = await category.save();
			return editedCategory;
		} catch (error) {
			throw error;
		}
	},

	softDeleteAProductCategory: async (categoryId) => {
		try {
			let category = await categoryModel.findById(categoryId);
			category.status = !category.status;
			category.save();
			return category;
		} catch (error) {
			throw error;
		}
	},
};
