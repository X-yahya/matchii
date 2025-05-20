const createError = require("../utils/createError"); 
const Project = require("../models/project.model") ; 

const createProject = async (req , res , next )=>
{
    if (req.isSeller)
    {
        return next(createError(403, "Only Clients can create a project!"));
    }
    try
    {
        const project = new Project({
            userId: req.userId,
            ...req.body,
        });
    const savedProject = await project.save() ; 
    res.status(201).json(savedProject) ; 
    }catch(err) 
    {
        next(err) ; 
    }
} ; 

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) 
      return next(createError(404, "Project not found"));

    // compare as strings
    if (project.userId.toString() !== req.userId) {
      return next(createError(403, "Not authorized to delete this project"));
    }

    await project.deleteOne();
    res.status(200).json( "Project has been deleted" );
  } catch (err) {
    next(err);
  }
};

const getProject = async (req, res , next) =>
{
    try 
    {
        const project = await Project.findById(req.params.id).populate('userId', 'username img level');
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
    res.status(200).json(project);        
    }catch(err)
    {
        next(err) ; 
    }
}

const getProjects = async (req , res , next)=>
{
    try
    {
        const projects = await Project.find({}).populate('userId', 'username img level');
        res.status(200).json(projects) ; 
    }catch(err)
    {
        next(err) ; 
    }
};
const getMyProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.userId })
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
module.exports = 
{
    createProject,
    deleteProject,
    getProject,
    getProjects,
    getMyProjects
} ;




