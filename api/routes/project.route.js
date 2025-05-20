// In your project routes file
const express = require("express");
const router = express.Router();
const {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  getMyProjects // Make sure to add this
} = require("../controllers/project.controller");
const verifyToken = require("../middleware/jwt");

router.post("/", verifyToken, createProject);
router.get("/", getProjects);
router.get("/myprojects", verifyToken, getMyProjects); // Must come before :id
router.get("/:id", getProject);
router.delete("/:id", verifyToken, deleteProject);

module.exports = router;