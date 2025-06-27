const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
  deleteMessage,
  updateMessage,
} = require("../controllers/messageControllers");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);
router.route("/:id")
  .put(protect, updateMessage)  
  .delete(protect, deleteMessage);

module.exports = router;
