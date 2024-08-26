import mongoose, { Document, Schema } from "mongoose";

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export interface ChatDocument extends Document {
  chatId: string;
  participants: [mongoose.Types.ObjectId];
  sender: mongoose.Types.ObjectId;
  content: string;
}

const Chat = mongoose.model<ChatDocument>("Chat", chatSchema);

export default Chat;
