import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import Chat from "../models/chat.model.js";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
