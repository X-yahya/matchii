const createError = require("../utils/createError.js");
const Conversation = require("../models/conversation.model.js");
const User = require("../models/user.model.js"); // Add this at the top
const createConversation = async (req, res, next) => {
  try {
    const { to, gigId, orderId } = req.body;
    
    if (!to) return next(createError(400, "Recipient ID is required"));

    const existing = await Conversation.findOne({
      $or: [
        { id: req.isSeller ? `${req.userId}${to}` : `${to}${req.userId}` },
        { gigId, $or: [{ sellerId: req.userId }, { buyerId: req.userId }] }
      ]
    });

    if (existing) return res.status(200).json(existing);

    const newConversation = new Conversation({
      id: req.isSeller ? `${req.userId}${to}` : `${to}${req.userId}`,
      sellerId: req.isSeller ? req.userId : to,
      buyerId: req.isSeller ? to : req.userId,
      readBySeller: !req.isSeller,
      readByBuyer: !req.isSeller,
      gigId,
      orderId
    });

    const savedConversation = await newConversation.save();
    const populated = await Conversation.findById(savedConversation._id)
      .populate('gigId', 'title')
      .populate('orderId', 'status');

    res.status(201).json(populated);
  } catch (err) {
    next(createError(500, "Failed to create conversation. Please try again later."));
  }
};
const getConversations = async (req, res, next) => {
  try {
    const userId = req.userId;

    const conversations = await Conversation.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    })
    .populate({
      path: 'projectId',
      select: 'title status',
      model: 'Project'
    })
    .populate({
      path: 'gigId',
      select: 'title',
      model: 'Gig'
    })
    .sort({ updatedAt: -1 });

    const formatted = await Promise.all(
      conversations.map(async (c) => {
        const otherUserId = c.sellerId === userId ? c.buyerId : c.sellerId;
        const otherUser = await User.findById(otherUserId).select("username image");
        
        return {
          id: c.id,
          lastMessage: c.lastMessage,
          updatedAt: c.updatedAt,
          gig: c.gigId ? {
            id: c.gigId._id,
            title: c.gigId.title
          } : null,
          project: c.projectId ? {
            id: c.projectId._id,
            title: c.projectId.title,
            status: c.projectId.status
          } : null,
          otherUserName: otherUser?.username || "Unknown",
          otherUserAvatar: otherUser?.image || "",
          readBySeller: c.readBySeller,
          readByBuyer: c.readByBuyer
        };
      })
    );

    res.status(200).send(formatted);
  } catch (err) {
    next(err);
  }
};
const updateConversation = async (req, res, next) => {
  try {
    const io = req.app.get('socketio');
    const updatedConversation = await Conversation.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
          lastMessage: req.body.lastMessage // Add this if updating message
        },
      },
      { new: true }
    ).populate('gigId', 'title')
     .populate('projectId', 'title');

    // Emit real-time update
    const otherUserId = req.isSeller ? updatedConversation.buyerId : updatedConversation.sellerId;

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
const checkExistingConversation = async (req, res, next) => {
  try {
    const { gigId, userId } = req.query;
    
    const conversation = await Conversation.findOne({
      gigId,
      $or: [
        { sellerId: req.userId, buyerId: userId },
        { sellerId: userId, buyerId: req.userId }
      ]
    })
    .populate('gigId', 'title')
    .lean();

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};


module.exports = {
  createConversation,
  updateConversation,
  getSingleConversation,
  getConversations,
  checkExistingConversation
};