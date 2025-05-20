const createError = require("../utils/createError.js");
const Conversation = require("../models/conversation.model.js");
const User = require("../models/user.model.js"); // Add this at the top


createConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller,
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(201).send(savedConversation);
  } catch (err) {
    next(err);
  }
};
updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          // readBySeller: true,
          // readByBuyer: true,
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      },
      { new: true }
    );

    res.status(200).send(updatedConversation);
  } catch (err) {
    next(err);
  }
};

// GET /api/conversations/:id
const getSingleConversation = async (req, res, next) => {
  try {
    const userId = req.userId;
    const conversation = await Conversation.findOne({ id: req.params.id });
    if (!conversation) return res.status(404).send("Conversation not found");

    // Find the other user's ID
    const otherUserId = conversation.sellerId === userId ? conversation.buyerId : conversation.sellerId;
    const otherUser = await User.findById(otherUserId).select("username image");

    res.status(200).json({
      ...conversation._doc,
      otherUserName: otherUser?.username || "User",
      otherUserAvatar: otherUser?.image || "",
    });
  } catch (err) {
    next(err);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Find all conversations where the user is either buyer or seller
    const conversations = await Conversation.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    }).sort({ updatedAt: -1 });

    // Fetch user info for the other participant in each conversation
    const formatted = await Promise.all(
      conversations.map(async (c) => {
        // Always get the other participant
        const otherUserId = c.sellerId === userId ? c.buyerId : c.sellerId;
        const otherUser = await User.findById(otherUserId).select("username image");
        return {
          _id: c._id,
          id: c.id,
          sellerId: c.sellerId,
          buyerId: c.buyerId,
          readBySeller: c.readBySeller,
          readByBuyer: c.readByBuyer,
          lastMessage: c.lastMessage,
          updatedAt: c.updatedAt,
          otherUserName: otherUser?.username || "Unknown",
          otherUserAvatar: otherUser?.image || "",
        };
      })
    );

    res.status(200).send(formatted);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createConversation,
  updateConversation,
  getSingleConversation,
  getConversations,
};