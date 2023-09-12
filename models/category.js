const mongoose = require('mongoose');


const categoryModel = new mongoose.Schema({
    
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    },

},{
    timestamps: true,
});


module.exports = mongoose.model("Category", categoryModel);