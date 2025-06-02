// models/Review.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  gigId: { 
    type: Schema.Types.ObjectId,
    ref: 'Gig',
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  star: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  desc: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);