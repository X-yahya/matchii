const Project = require("../models/project.model");
const Proposal = require("../models/proposal.model");
const User = require("../models/user.model");
const createError = require("../utils/createError");

const createProposal = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return next(createError(404, "Project not found"));
    
    if (project.userId === req.userId) {
      return next(createError(403, "You can't propose to your own project"));
    }

    const newProposal = new Proposal({
      projectId: project._id,
      freelancerId: req.userId,
      clientId: project.userId,
      coverLetter: req.body.coverLetter
    });

    await newProposal.save();
    res.status(201).json("Proposal submitted successfully");
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
  createProposal,
  getProposals,
  updateProposalStatus
};