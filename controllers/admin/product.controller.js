const categoryHelper = require("../../helpers/categoryHelper");
const productHelper = require("../../helpers/productHelper");
const { currencyFormatWithoutDecimal } = require("../../utils/currency-format");

const productList = async (req, res, next) => {
	try {
		const responseProduct = await productHelper.getAllProductsWithLookup();
		for (let i = 0; i < responseProduct.length; i++) {
			responseProduct[i].product_price = currencyFormatWithoutDecimal(
				responseProduct[i].product_price
			);
			responseProduct[i].product_discount = currencyFormatWithoutDecimal(
				responseProduct[i].product_discount
			);
		}

		res.render("admin/products-list", {
			layout: ADMIN_LAYOUT,
			products: responseProduct,
		});
	} catch (error) {
		next(error);
	}
};

// To get add product list and product page.
const addProduct = async (req, res, next) => {
	try {
		const product = await categoryHelper.getAllcategory();

		res.render("admin/add-product", {
			layout: ADMIN_LAYOUT,
			category: product,
		});
	} catch (error) {
		next(error);
	}
};

const postAddProduct = async (req, res, next) => {
	const category = await categoryHelper.getAcategory(
		req.body.product_category
	);
	if (!category) throw new Error("Given category is not Present");

	try {
		await productHelper.addProductToDb(req.body, req.files);

		res.status(201).redirect("/admin/product");
	} catch (error) {
		next(error);
	}
};

const editProduct = async (req, res, next) => {
	try {
		const product = await productHelper.getAProduct(req.params.slug);
		const categories = await categoryHelper.getAllcategory();

		if (product == "") {
			res.status(401).redirect("/admin");
		} else {
			res.status(200).render("admin/edit-product", {
				product,
				categories,
				layout: ADMIN_LAYOUT,
			});
		}
	} catch (error) {
		next(error);
	}
};

const postEditProduct = async (req, res, next) => {
	try {
		await productHelper.postEditAProduct(
			req.body,
			req.params.slug,
			req.file
		);

		res.status(200).redirect("/admin/product");
	} catch (error) {
		next(error);
	}
};

// List and unlist product
const deleteProduct = async (req, res, next) => {
	try {
		const result = await productHelper.softDeleteProduct(req.params.slug);

		if (result.product_status) {
			res.status(200).json({
				error: false,
				message: "product unblocked ",
				product: result,
			});
		} else {
			res.status(200).json({
				error: false,
				message: "product deleted",
				product: result,
			});
		}
	} catch (error) {
		next(error);
	}
};




module.exports = {
    productList,
	addProduct,
	postAddProduct,
	editProduct,
	postEditProduct,
	deleteProduct,
}