const mongoose = require("mongoose") ; 

const { Schema } = mongoose;

const converstationSchema = new Schema({
    gigId : 
    {
        type : String , 
        required : true, 
    },
    userId : 
    {
        type : String , 
        required : true, 
    },
    sellerId : 
    {
        type : String , 
        required : true, 
    },
    readBySeller : 
    {
        type : Boolean , 
        default : false , 
    },
    readByBuyer : 
    {
        type : Boolean , 
        default : false , 
    },
    lastMessage : 
    {
        type : String , 
        required : false, 
    },

}, { timestamps: true });

module.exports = mongoose.model("Conversation", converstationSchema);


