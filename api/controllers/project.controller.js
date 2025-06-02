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
        const project = await Project.findById(req.params.id)
            .populate('userId', 'username image level')
            .populate('team.freelancerId', 'username image country sellerStats');
        
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
    const q = req.query;

    // Validate query parameters
    if (q.minBudget && isNaN(Number(q.minBudget))) {
      return next(createError(400, "Min budget must be a number"));
    }
    if (q.maxBudget && isNaN(Number(q.maxBudget))) {
      return next(createError(400, "Max budget must be a number"));
    }

    // Build filters
    const filters = {
      ...(q.search && {
        $or: [
          { title: { $regex: q.search, $options: "i" } },
          { description: { $regex: q.search, $options: "i" } },
          { 'requiredRoles.name': { $regex: q.search, $options: "i" } }
        ]
      }),
      ...(q.category && { category: q.category }),
      ...(q.minBudget && { budget: { $gte: Number(q.minBudget) } }),
      ...(q.maxBudget && { budget: { $lte: Number(q.maxBudget) } }),
      ...(q.role && { 'requiredRoles.name': { $regex: q.role, $options: "i" } }),
      ...(q.availableRoles === 'true' && { 'requiredRoles.filled': false })
    };

    // Build sort options
    const sortOptions = {};
    if (q.sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (q.sort === 'highest') {
      sortOptions.budget = -1;
    } else if (q.sort === 'lowest') {
      sortOptions.budget = 1;
    }

    const projects = await Project.find(filters)
      .sort(sortOptions)
      .populate('userId', 'username image level');
      
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

        // Find the team member to get their assigned role
        const teamMember = project.team.find(
            member => member.freelancerId.toString() === req.body.freelancerId
        );

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

        // If freelancer had an assigned role, mark it as unfilled
        if (teamMember && teamMember.assignedRoleId) {
            const role = updatedProject.requiredRoles.id(teamMember.assignedRoleId);
            if (role) {
                role.filled = false;
                await updatedProject.save();
            }
        }

        // Update project status if no team members left
        if (updatedProject.team.length === 0 && updatedProject.status === 'in_progress') {
            await Project.findByIdAndUpdate(
                req.params.id,
                { status: 'open' }
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

// New controller function to assign freelancer to specific role
const assignFreelancerToRole = async (req, res, next) => {
    try {
        const { projectId, roleId, freelancerId } = req.params;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return next(createError(404, "Project not found"));
        }

        if (project.userId.toString() !== req.userId) {
            return next(createError(403, "Not authorized to modify this project"));
        }

        // Find the role
        const role = project.requiredRoles.id(roleId);
        if (!role) {
            return next(createError(404, "Role not found"));
        }

        if (role.filled) {
            return next(createError(400, "Role is already filled"));
        }

        // Check if freelancer is already in the team
        const existingMember = project.team.find(
            member => member.freelancerId.toString() === freelancerId
        );

        if (existingMember) {
            return next(createError(400, "Freelancer is already part of the team"));
        }

        // Assign freelancer to role
        await project.fillRole(roleId, freelancerId);

        // Update proposal status
        await Proposal.findOneAndUpdate(
            {
                projectId: projectId,
                freelancerId: freelancerId,
                status: 'pending'
            },
            { status: 'accepted' }
        );

        const updatedProject = await Project.findById(projectId)
            .populate('team.freelancerId', 'username image country sellerStats');

        res.json(updatedProject);
    } catch (err) {
        next(err);
    }
};

// New controller function to add roles to existing project
const addRolesToProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return next(createError(404, "Project not found"));
        }

        if (project.userId.toString() !== req.userId) {
            return next(createError(403, "Not authorized to update this project"));
        }

        const { roles } = req.body;
        
        if (!Array.isArray(roles)) {
            return next(createError(400, "Roles must be an array"));
        }

        // Add new roles to existing ones
        project.requiredRoles.push(...roles);
        await project.save();

        res.json(project);
    } catch (err) {
        next(err);
    }
};

// New controller function to update role information
const updateRole = async (req, res, next) => {
    try {
        const { projectId, roleId } = req.params;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return next(createError(404, "Project not found"));
        }

        if (project.userId.toString() !== req.userId) {
            return next(createError(403, "Not authorized to update this project"));
        }

        const role = project.requiredRoles.id(roleId);
        if (!role) {
            return next(createError(404, "Role not found"));
        }

        // Update role properties
        Object.assign(role, req.body);
        await project.save();

        res.json(project);
    } catch (err) {
        next(err);
    }
};

// New controller function to delete a role
const deleteRole = async (req, res, next) => {
    try {
        const { projectId, roleId } = req.params;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return next(createError(404, "Project not found"));
        }

        if (project.userId.toString() !== req.userId) {
            return next(createError(403, "Not authorized to update this project"));
        }

        const role = project.requiredRoles.id(roleId);
        if (!role) {
            return next(createError(404, "Role not found"));
        }

        // If role is filled, remove freelancer from team first
        if (role.filled) {
            project.team = project.team.filter(
                member => member.assignedRoleId && member.assignedRoleId.toString() !== roleId
            );
        }

        // Remove the role
        project.requiredRoles.pull(roleId);
        await project.save();

        res.json(project);
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
    removeFreelancer,
    assignFreelancerToRole,
    addRolesToProject,
    updateRole,
    deleteRole
};