const Project = require("../models/project.model");
const Proposal = require("../models/proposal.model");
const User = require("../models/user.model");
const createError = require("../utils/createError");

const checkProposal = async (req, res, next) => {
    try {
        const proposal = await Proposal.findOne({
            projectId: req.params.projectId,
            freelancerId: req.userId
        });

        res.status(200).json(!!proposal);
    } catch (err) {
        next(err);
    }
};

const createProposal = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.projectId);
        if (!project) return next(createError(404, "Project not found"));

        if (project.userId.toString() === req.userId) {
            return next(createError(403, "Can't propose to your own project"));
        }

        // Check if user already has a proposal for this project
        const existingProposal = await Proposal.findOne({
            projectId: req.params.projectId,
            freelancerId: req.userId
        });

        if (existingProposal) {
            return next(createError(400, "You have already submitted a proposal for this project"));
        }

        const newProposal = await Proposal.create({
            projectId: project._id,
            freelancerId: req.userId,
            clientId: project.userId,
            coverLetter: req.body.coverLetter
        });

        // Add proposal to project's proposals array
        try {
            await Project.findByIdAndUpdate(
                project._id,
                { $push: { proposals: newProposal._id } },
                { new: true }
            );
        } catch (updateErr) {
            // Rollback proposal creation if linking fails
            await Proposal.findByIdAndDelete(newProposal._id);
            return next(createError(500, "Failed to link proposal to project"));
        }

        res.status(201).json(newProposal);
    } catch (err) {
        next(err);
    }
};

const getProposals = async (req, res, next) => {
    try {
        const baseQuery = req.isSeller
            ? { freelancerId: req.userId }
            : { clientId: req.userId };

        const proposals = await Proposal.find(baseQuery)
            .populate({
                path: 'projectId',
                select: 'title budget duration status category coverImage',
                model: 'Project'
            })
            .populate({
                path: req.isSeller ? 'clientId' : 'freelancerId',
                select: 'username image country sellerStats',
                model: 'User'
            })
            .sort({ createdAt: -1 });

        const enhancedProposals = proposals.map(proposal => ({
            ...proposal.toObject(),
            project: proposal.projectId,
            counterpart: req.isSeller ? proposal.clientId : proposal.freelancerId
        }));

        res.status(200).json(enhancedProposals);
    } catch (err) {
        next(err);
    }
};

// Enhanced updateProposalStatus with better team management
const updateProposalStatus = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate({
        path: 'projectId',
        select: 'userId status team budget requiredRoles'
      })
      .populate({
        path: 'freelancerId',
        select: '_id username image country sellerStats'
      });

    if (!proposal) {
      return next(createError(404, "Proposal not found"));
    }

    if (proposal.projectId.userId.toString() !== req.userId) {
      return next(createError(403, "Unauthorized to update this proposal"));
    }

    const { status, reason, roleId } = req.body;

    // Update proposal status with optional reason
    const updateData = {
      status: status,
      ...(reason && { rejectionReason: reason }),
      ...(status === 'accepted' && { 
        acceptedAt: new Date(),
        ...(roleId && { assignedRoleId: roleId })
      }),
      ...(status === 'rejected' && { rejectedAt: new Date() })
    };

    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (status === 'accepted') {
      // Find the project
      const project = await Project.findById(proposal.projectId._id);

      // If roleId is provided, assign to specific role
      if (roleId) {
        const role = project.requiredRoles.id(roleId);
        if (role && !role.filled) {
          project.fillRole(roleId, proposal.freelancerId._id, proposal._id);
          await project.save();
        }
      }

      // Update project status if needed
      if (project.status === 'open') {
        project.status = 'in_progress';
        await project.save();
      }

      // Update freelancer's stats for accepted proposal
      await User.findByIdAndUpdate(
        proposal.freelancerId._id,
        {
          $inc: {
            'sellerStats.acceptedProposals': 1
          }
        }
      );
    } else if (status === 'rejected') {
      // Remove from team if they were already added
      await Project.findByIdAndUpdate(
        proposal.projectId._id,
        {
          $pull: { team: { freelancerId: proposal.freelancerId._id } }
        }
      );

      // Optionally unfill the role if needed
      if (roleId) {
        await Project.updateOne(
          { _id: proposal.projectId._id, "requiredRoles._id": roleId },
          { $set: { "requiredRoles.$.filled": false, "requiredRoles.$.freelancerId": null, "requiredRoles.$.filledBy": null } }
        );
      }

      // Update freelancer's stats for rejected proposal
      await User.findByIdAndUpdate(
        proposal.freelancerId._id,
        {
          $inc: {
            'sellerStats.rejectedProposals': 1
          }
        }
      );
    }

    // Calculate and update freelancer's acceptance rate
    const freelancerProposals = await Proposal.find({ 
      freelancerId: proposal.freelancerId._id 
    });
    const accepted = freelancerProposals.filter(p => p.status === 'accepted').length;
    const total = freelancerProposals.filter(p => p.status !== 'pending').length;
    const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    await User.findByIdAndUpdate(
      proposal.freelancerId._id,
      {
        'sellerStats.acceptanceRate': acceptanceRate
      }
    );

    res.status(200).json(updatedProposal);
  } catch (err) {
    next(err);
  }
};

// New function to get proposal details with enhanced info
const getProposalDetails = async (req, res, next) => {
    try {
        const proposal = await Proposal.findById(req.params.id)
            .populate({
                path: 'projectId',
                select: 'title budget duration status category description userId',
                populate: {
                    path: 'userId',
                    select: 'username image country'
                }
            })
            .populate({
                path: 'freelancerId',
                select: 'username image country sellerStats bio skills'
            })
            .populate({
                path: 'clientId',
                select: 'username image country clientStats'
            });

        if (!proposal) {
            return next(createError(404, "Proposal not found"));
        }

        // Check if user has permission to view this proposal
        const isFreelancer = proposal.freelancerId._id.toString() === req.userId;
        const isClient = proposal.clientId._id.toString() === req.userId;

        if (!isFreelancer && !isClient) {
            return next(createError(403, "Not authorized to view this proposal"));
        }

        res.status(200).json(proposal);
    } catch (err) {
        next(err);
    }
};

const getFreelancerProposalStats = async (req, res, next) => {
    try {
        const freelancerId = req.params.freelancerId || req.userId;

        if (freelancerId !== req.userId) {
            const proposal = await Proposal.findOne({
                freelancerId: freelancerId,
                clientId: req.userId
            });
            
            if (!proposal) {
                return next(createError(403, "Not authorized to view these stats"));
            }
        }

        const stats = await Proposal.aggregate([
            { $match: { freelancerId: require('mongoose').Types.ObjectId(freelancerId) } },
            {
                $group: {
                    _id: null,
                    totalProposals: { $sum: 1 },
                    acceptedProposals: {
                        $sum: { $cond: [{ $eq: ["$status", "accepted"] }, 1, 0] }
                    },
                    rejectedProposals: {
                        $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
                    },
                    pendingProposals: {
                        $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                    },
                    completedProposals: {
                        $sum: { $cond: ["$isCompleted", 1, 0] }
                    }
                }
            }
        ]);

        const result = stats[0] || {
            totalProposals: 0,
            acceptedProposals: 0,
            rejectedProposals: 0,
            pendingProposals: 0,
            completedProposals: 0
        };

        // Calculate rates
        result.acceptanceRate = result.totalProposals > 0 
            ? Math.round((result.acceptedProposals / result.totalProposals) * 100) 
            : 0;
        
        result.completionRate = result.acceptedProposals > 0 
            ? Math.round((result.completedProposals / result.acceptedProposals) * 100) 
            : 0;

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    checkProposal,
    createProposal,
    getProposals,
    updateProposalStatus,
    getProposalDetails,
    getFreelancerProposalStats
};