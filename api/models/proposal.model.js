const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProposalSchema = new Schema({
  projectId: {
    type: String,
    required: true,
  },
  freelancerId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
    minlength: [150, 'Cover letter must be at least 150 characters'],
    maxlength: [1500, 'Cover letter cannot exceed 1500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Proposal", ProposalSchema);