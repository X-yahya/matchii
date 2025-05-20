const mongoose = require('mongoose');
const { Schema } = mongoose;

const projectSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,     
    ref: 'User',                     
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String, 
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  budget: {
    type: Number,
    required: true,
    min: 1,
  },
  duration: {
    type: Number,
    required: true,
    min: 1, 
  },
  coverImage: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled'],
    default: 'draft',
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);