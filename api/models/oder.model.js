const mongoose = require("mongoose") ; 

const { Schema } = mongoose;

const orderSchema = new Schema({
    gigId: {
        type: String,
        required: true,
    },
    img :
    {
        type : String  , 
        required : false ,
    } , 
    title: {
        type: String,
        required: true,
    },
    buyerId: {
        type: String,
        required: true,
    },
    sellerId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    payment_intent: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);


