const { getAllcategory } = require('../helpers/categoryHelper');

const categorySupply = async (req, res, next) => {
    try {
        // console.log(allCategories);
        const allCategories = await getAllcategory();
        res.locals.allCategories = allCategories;
        next();
    } catch (error) {
        res.status(500).redirect('/error')

    }

}

module.exports = categorySupply;