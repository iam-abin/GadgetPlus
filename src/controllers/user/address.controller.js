const addressHelper = require("../../helpers/addressHelper");

const addAddress = async (req, res, next) => {
    try {
        await addressHelper.addAddress(req.body);
        res.status(201).json({ message: "address added successfully" });
    } catch (error) {
        next(error);
    }
};

const editAddress = async (req, res, next) => {
    try {
        let address = await addressHelper.getAnAddress(req.params.id);
        res.status(200).json({ address });
    } catch (error) {
        next(error);
    }
};

const editAddressPost = async (req, res, next) => {
    try {
        await addressHelper.editAnAddress(req.body);
        res.status(200).json({ message: "address updated" });
    } catch (error) {
        next(error);
    }
};

const deleteAddressPost = async (req, res, next) => {
    try {
        await addressHelper.deleteAnAddress(req.params.id);
        res.status(200).json({ message: "address Deleted Successfully.." });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addAddress,
    editAddress,
    editAddressPost,
    deleteAddressPost,
};
