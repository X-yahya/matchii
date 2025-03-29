const mongoose = require("mongoose") ; 

const { Schema } = mongoose;

const gigSchema = new Schema({
    userId : 
    {
        type : string , 
        required : true ,
    } , 
    title: {
        type: String,
        required: true,
        unique: false,
        trim: true,
    } , 
    shortTitle : 
    {
        type: String,
        required: true,
        unique: false,
        trim: true,
    },
    description : {
        type: String,
        required: true
    },
    deliveryTime: {
        type: Number,
        required: true,
    },
    revisionNumber : {
        type: Number,
        required: true,
    },
    features : 
    {
        type : [String] ,
    },
    totalStarts : {
        type: Number,
        // required: true,
        
    },
    starNumber: {
        type: Number,
    },
    cat: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sales: {
        type: Number,
        default: 0,
    },
    cover: {
        type: string,
        required : true , 
    },
    image: {
        type: [string],
        required : false , 
    }
}, { timestamps: true });





module.exports = mongoose.model("Gig", gigSchema);



