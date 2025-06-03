const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProposalSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  appliedRoleId: {
    type: Schema.Types.ObjectId,
    ref: 'Project.requiredRoles',
    required: true
  },
  assignedRoleId: {
    type: Schema.Types.ObjectId,
    ref: 'Project.requiredRoles',
    default: null
  },
  rejectionReason: String,
  acceptedAt: Date,
  rejectedAt: Date
}, { timestamps: true });

module.exports = mongoose.model("Proposal", ProposalSchema);