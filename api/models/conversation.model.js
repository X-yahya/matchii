const mongoose = require("mongoose") ; 

const { Schema } = mongoose;

const conversationSchema = new Schema({
    id: { type: String, required: true, unique: true },
    sellerId: { type: String, required: true },
    buyerId: { type: String, required: true },
    readBySeller: { type: Boolean, default: false },
    readByBuyer: { type: Boolean, default: false },
    lastMessage: { type: String },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
    gigId: { type: Schema.Types.ObjectId, ref: 'Gig' },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });
module.exports = mongoose.model("Conversation", conversationSchema);




