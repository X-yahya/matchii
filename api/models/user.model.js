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
    verified: {
    type: Boolean,
    default: false,
  },
  
  otp: String,
  otpExpires: Date,
  password: {
      type: String,
      required: true,
      trim: true
    },
    image: { 
      type: String,
      required: false,
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
    },
    sellerStats: {
    completedProjects: { type: Number, default: 0 },
    activeProjects: { type: Number, default: 0 },
    clientsWorkedWith: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    successRate: { type: Number, default: 100 } // Percentage
  },
  }, { timestamps: true });

module.exports = mongoose.model("User", userSchema);


