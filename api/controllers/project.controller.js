const createError = require("../utils/createError");
const Project = require("../models/project.model");
const Proposal = require("../models/proposal.model");

const createProject = async (req, res, next) => {
    if (req.isSeller) {
        return next(createError(403, "Only Clients can create a project!"));
    }
    try {
        const project = new Project({
            userId: req.userId,
            ...req.body,
        });
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (err) {
        next(err);
    }
};

const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project)
            return next(createError(404, "Project not found"));

        if (project.userId.toString() !== req.userId) {
            return next(createError(403, "Not authorized to delete this project"));
        }

        await project.deleteOne();
        res.status(200).json("Project has been deleted");
    } catch (err) {
        next(err);
    }
};

const getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id).populate('userId', 'username image level');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (err) {
        next(err);
    }
}

const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({}).populate('userId', 'username image level');
        res.status(200).json(projects);
    } catch (err) {
        next(err);
    }
};

const getMyProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({ userId: req.userId })
            .populate({
                path: 'team.freelancerId',
                select: 'username image country sellerStats'
            })
            .populate({
                path: 'proposals',
                populate: {
                    path: 'freelancerId',
                    select: 'username image country sellerStats'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(projects);
    } catch (err) {
        next(err);
    }
};

const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return next(createError(404, "Project not found"));
        }

        if (project.userId.toString() !== req.userId) {
            return next(createError(403, "Not authorized to update this project"));
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProject);
    } catch (err) {
        next(err);
    }
};

const removeFreelancer = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return next(createError(404, "Project not found"));
        }

        if (project.userId.toString() !== req.userId) {
            return next(createError(403, "Not authorized to modify this project"));
        }

        // Remove freelancer from team
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { team: { freelancerId: req.body.freelancerId } }
            },
            { new: true }
        ).populate({
            path: 'team.freelancerId',
            select: 'username image country sellerStats'
        });

        // Update project status if no team members left
        if (updatedProject.team.length === 0 && updatedProject.status === 'in_progress') {
            await Project.findByIdAndUpdate(
                req.params.id,
                { status: 'open' || 'in_progress' }
            );
        }

        // Update the freelancer's proposal status to rejected
        await Proposal.findOneAndUpdate(
            {
                projectId: req.params.id,
                freelancerId: req.body.freelancerId,
                status: 'accepted'
            },
            { status: 'rejected' }
        );

        res.json(updatedProject);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    getMyProjects,
    updateProject,
    removeFreelancer
};

