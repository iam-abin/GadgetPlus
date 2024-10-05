
const productCategory = async (req, res, next) => {
	try {
		const category = await categoryHelper.getAllcategory();
		res.render("admin/product-categories", {
			layout: ADMIN_LAYOUT,
			categories: category,
		});
	} catch (error) {
		next(error);
	}
};

const postAddProductCategory = async (req, res) => {
	try {
		await categoryHelper.addCategoryTooDb(req.body);
		res.status(200).redirect("/admin/product-categories");
	} catch (error) {
		if (error.code === 11000) {
			res.status(200).json({
				error: true,
				message: "Category already Exist!!!",
			});
		} else {
			res.status(500).redirect("/error");
		}
	}
};

const editProductCategory = async (req, res, next) => {
	try {
		const editedCatrgory = await categoryHelper.getAcategory(req.params.id);
		res.status(200).json({ category: editedCatrgory });
	} catch (error) {
		next(error);
	}
};

const editProductCategoryPost = (req, res) => {
	categoryHelper
		.editCategory(req.body)
		.then((response) => {
			res.status(202).json({ message: "category updated" });
		})
		.catch((error) => {
			if (error.code === 11000) {
				res.status(500).json({
					error: true,
					message: "Category already Exist!!!",
				});
			} else {
				res.status(500).redirect("/error");
			}
		});
};

const deleteProductCategory = (req, res, next) => {
	try {
		const response = categoryHelper.softDeleteAProductCategory(
			req.params.id
		);

		if (response.status) {
			res.status(200).json({
				error: false,
				message: "category listed",
				listed: true,
			});
		} else {
			res.status(200).json({
				error: false,
				message: "category unlisted",
				listed: false,
			});
		}
	} catch (error) {
		next(error);
	}
};


module.exports = {
    productCategory,
	postAddProductCategory,
	editProductCategory,
	editProductCategoryPost,
	deleteProductCategory,
}