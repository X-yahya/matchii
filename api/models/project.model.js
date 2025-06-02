const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  budget: Number,
  duration: Number,
  category: String,
  requiredRoles: [{
    name: { type: String, required: true },
    description: String,
    budget: { type: Number, required: true },
    filled: { type: Boolean, default: false },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    filledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  team: [{
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: String,
    assignedRoleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project.requiredRoles'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Proposal'
    }
  }],
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed'],
    default: 'open'
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  }],
  coverImage: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual to get unfilled roles
projectSchema.virtual('unfilledRoles').get(function() {
  return this.requiredRoles.filter(role => !role.filled);
});

// Method to mark role as filled
projectSchema.methods.fillRole = function(roleId, freelancerId, proposalId) {
  const role = this.requiredRoles.id(roleId);
  if (role && !role.filled) {
    role.filled = true;
    role.filledBy = freelancerId;
    this.team.push({
      freelancerId,
      role: role.name,
      assignedRoleId: roleId,
      proposalId,
      joinedAt: new Date()
    });
    return true;
  }
  return false;
};

// Method to unfill role when freelancer is removed
projectSchema.methods.unfillRole = function(roleId) {
  const role = this.requiredRoles.id(roleId);
  if (role && role.filled) {
    role.filled = false;
    role.filledBy = null;
    this.team = this.team.filter(member =>
      member.assignedRoleId && member.assignedRoleId.toString() !== roleId.toString()
    );
    return true;
  }
  return false;
};

module.exports = mongoose.model('Project', projectSchema);