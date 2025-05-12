const mongoose = require('mongoose');
const { Schema } = mongoose;




const OrderSchema = new Schema(
    {
        gigId : {
            type : String ,
            required : true ,
        } ,
        img : {
            type : String ,
            required : true ,
        } ,
        title : {
            type : String ,
            required : true ,
        } ,
        price : {
            type : Number ,
            required : true ,
        } ,
        buyerId : {
            type : String ,
            required : true ,
        } ,
        sellerId : {
            type : String ,
            required : true ,
        } , 
        isCompleted: {
      type: Boolean,
      default: false,
    },
        paymentIntent: {
      type: String,
    },
    },
    { timestamps: true }
) ;



module.exports = mongoose.model("Order", OrderSchema) ;