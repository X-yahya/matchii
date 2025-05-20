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

// Update createProposal to modify project
const createProposal = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return next(createError(404, "Project not found"));
    
    if (project.userId.toString() === req.userId) {
      return next(createError(403, "Can't propose to your own project"));
    }

    const newProposal = await Proposal.create({
      projectId: project._id,
      freelancerId: req.userId,
      clientId: project.userId,
      coverLetter: req.body.coverLetter
    });

    await Project.findByIdAndUpdate(
      project._id,
      { $push: { proposals: newProposal._id } }
    );

    res.status(201).json(newProposal);
  } catch (err) {
    next(err);
  }
};

const getProposals = async (req, res, next) => {
  try {
    const proposals = await Proposal.find({
      ...(req.isSeller ? { freelancerId: req.userId } : { clientId: req.userId })
    });

    // Get related data in single queries
    const [projects, users] = await Promise.all([
      Project.find({ _id: { $in: proposals.map(p => p.projectId) } }),
      User.find({ _id: { $in: proposals.map(p => req.isSeller ? p.clientId : p.freelancerId) } })
    ]);

    const projectMap = new Map(projects.map(p => [p._id.toString(), p]));
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    const enhancedProposals = proposals.map(proposal => ({
      ...proposal._doc,
      project: projectMap.get(proposal.projectId.toString()),
      counterpart: req.isSeller ? 
        userMap.get(proposal.clientId.toString()) : 
        userMap.get(proposal.freelancerId.toString())
    }));

    res.status(200).json(enhancedProposals);
  } catch (err) {
    next(err);
  }
};

const updateProposalStatus = async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) return next(createError(404, "Proposal not found"));

    // Authorization check
    if (proposal.clientId !== req.userId) {
      return next(createError(403, "Only project owner can update status"));
    }

    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    // If accepted, update project status
    if (req.body.status === 'accepted') {
      await Project.findByIdAndUpdate(
        proposal.projectId,
        { status: 'in_progress', freelancerId: proposal.freelancerId }
      );
    }

    res.status(200).json(updatedProposal);
  } catch (err) {
    next(err);
  }
};

module.exports = {
    checkProposal,
  createProposal,
  getProposals,
  updateProposalStatus
};