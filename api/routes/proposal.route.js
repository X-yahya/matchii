const express = require("express");
const verifyToken = require("../middleware/jwt");
const router = express.Router();
const {
  createProposal,
  getProposals,
  updateProposalStatus
} = require("../controllers/proposal.controller");

router.post("/:projectId", verifyToken, createProposal);
router.get("/", verifyToken, getProposals);
router.patch("/:id", verifyToken, updateProposalStatus);

module.exports = router;