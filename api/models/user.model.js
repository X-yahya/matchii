const mongoose = require("mongoose") ; 



const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    image: { 
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: false,
      trim: true
    },
    description: {  // Corrected typo from 'decription'
      type: String,
      required: false,
      trim: true
    },
    isSeller: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });

module.exports = mongoose.model("User", userSchema);


