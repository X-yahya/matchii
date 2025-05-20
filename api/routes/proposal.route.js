const express = require("express");
const verifyToken = require("../middleware/jwt");
const router = express.Router();
const {
  createProposal,
  getProposals,
  updateProposalStatus,
  checkProposal
} = require("../controllers/proposal.controller");

router.post("/:projectId", verifyToken, createProposal);
router.get("/", verifyToken, getProposals);
router.get("/check/:projectId", verifyToken, checkProposal); // Add this line
router.patch("/:id", verifyToken, updateProposalStatus);

module.exports = router;