const { getAllcategory } = require('../helpers/categoryHelper');


const categorySupply = async (req, res, next) => {
    try {
        const allCategories = await getAllcategory();
        res.locals.allCategories = allCategories; // Pass 'allCategories' data directly to views. Its scope is current request.
        next();
    } catch (error) {
        next(error)
    }
}


module.exports = categorySupply;
