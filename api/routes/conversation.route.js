// conversation.route.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/jwt");
const {
  createConversation,
  updateConversation,
  getSingleConversation,
  getConversations,
  checkExistingConversation // Add this
} = require("../controllers/conversation.controller");

router.get("/", verifyToken, getConversations);
router.get("/check", verifyToken, checkExistingConversation); // Add this line
router.post("/", verifyToken, createConversation);
router.get("/single/:id", verifyToken, getSingleConversation);
router.put("/:id", verifyToken, updateConversation);

module.exports = router;