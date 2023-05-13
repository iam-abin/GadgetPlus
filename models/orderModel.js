const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        orderedItems:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'products'
                },
                quantity:Number
            }
        ],
        address:mongoose.Schema.Types.ObjectId,
        orderDate:Date,
        totalAmount: Number,
        // finalAmount:Number,
        paymentMethod: String,
        orderStatus: String
    },
    {
        timestamps: true,
    }
);

module.exports = new mongoose.model("Order", orderSchema);
