const mongoose = require("mongoose") ; 

const { Schema } = mongoose;

const converstationSchema = new Schema({
    id: { type: String, required: true, unique: true }, // <-- Make sure this exists
    sellerId: { type: String, required: true },
    buyerId: { type: String, required: true },
    readBySeller: { type: Boolean, default: false },
    readByBuyer: { type: Boolean, default: false },
    lastMessage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Conversation", converstationSchema);




