const asyncHandler = require("express-async-handler");
const Message = require("../Models/MessageModel");
const User = require("../Models/UserModel");
const Chat = require("../Models/ChatModel");

//required things: chatId , Actualmessage , who is the sender(comes from authmiddleware[login user])
const { encrypt } = require("../Utils/encryption");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  // Encrypt the message content before storing
  const encryptedContent = encrypt(content);

  var newMessage = {
    sender: req.user._id,
    content: encryptedContent,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    //   Decrypt before sending back to frontend
    //  message.content = decrypt(message.content);

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    // // Decrypt message contents
    // const decryptedMessages = messages.map((msg) => {
    //   return {
    //     ...msg.toObject(),
    //     content: decrypt(msg.content),
    //   };
    // });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Optionally: check if the requesting user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You can delete only your messages" });
    }

    await message.deleteOne();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



module.exports = { sendMessage, allMessages, deleteMessage };
