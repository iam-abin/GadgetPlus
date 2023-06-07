const { getAllcategory } = require('../helpers/categoryHelper');

const categorySupply = async (req, res, next) => {
    try {
        const allCategories = await getAllcategory();
        res.locals.allCategories = allCategories;
        next();
    } catch (error) {
        next(error)
    }
}

module.exports = categorySupply;