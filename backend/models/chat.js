const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    ref: "User",
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      ref: "Item",
    },
    buyerId: {
      type: String,
      ref: "User",
    },
    sellerId: {
      type: String,
      ref: "User",
    },
    messages: {
      type: [messageSchema],
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
