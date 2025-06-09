const express = require("express");
const router = express.Router();
const {
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
    deleteRole , 
    getMyAssignedProjects
} = require("../controllers/project.controller");
const verifyToken = require("../middleware/jwt");

// Main project routes
router.post("/", verifyToken, createProject);
router.get("/", getProjects);
router.get("/myprojects", verifyToken, getMyProjects);
router.get("/assigned", verifyToken, getMyAssignedProjects); // Add this new route
router.get("/:id", getProject);
router.delete("/:id", verifyToken, deleteProject);
router.patch("/:id", verifyToken, updateProject);

// Team management routes
router.patch("/:id/remove-freelancer", verifyToken, removeFreelancer);
router.post("/:projectId/roles/:roleId/assign/:freelancerId", verifyToken, assignFreelancerToRole);

// Role management routes
router.post("/:id/roles", verifyToken, addRolesToProject);
router.patch("/:projectId/roles/:roleId", verifyToken, updateRole);
router.delete("/:projectId/roles/:roleId", verifyToken, deleteRole);

module.exports = router;