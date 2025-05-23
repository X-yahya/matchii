const express = require("express");
const router = express.Router();
const {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    getMyProjects,
    updateProject,
    removeFreelancer
} = require("../controllers/project.controller");
const verifyToken = require("../middleware/jwt");

router.post("/", verifyToken, createProject);
router.get("/", getProjects);
router.get("/myprojects", verifyToken, getMyProjects);
router.get("/:id", getProject);
router.delete("/:id", verifyToken, deleteProject);
router.patch("/:id/remove-freelancer", verifyToken, removeFreelancer);
router.patch("/:id", verifyToken, updateProject);

module.exports = router;