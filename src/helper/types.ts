import mongoose from "mongoose";

export interface createChatType {
  chatId: string;
  participants: [mongoose.Types.ObjectId];
  sender: mongoose.Types.ObjectId;
}
