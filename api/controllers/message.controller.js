const createError = require("../utils/createError");
const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model") ;


const createMessage = async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  try {
    const savedMessage = await newMessage.save();

    // Update the conversation's lastMessage and updatedAt
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          lastMessage: req.body.desc,
          updatedAt: Date.now(),
        },
      }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};



const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};





module.exports = {
    createMessage,
    getMessages
}
