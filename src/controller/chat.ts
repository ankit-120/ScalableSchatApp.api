import { Request, Response } from "express";
import Chat, { ChatDocument } from "../schema/chatSchema";
import { createChatType } from "../helper/types";

export const getOrCreateChat = async (req: Request, res: Response) => {
  try {
    const { participants, sender, chatId }: createChatType = req.body;
    if (!participants || !sender || !chatId)
      return res
        .status(400)
        .json({ success: false, message: "Payload missing" });

    const existingChat = await Chat.findOne({ chatId });
    if (existingChat) {
      return res.status(200).json({ success: true, data: existingChat });
    }

    const newChat: ChatDocument = new Chat({
      chatId,
      participants,
      sender,
      content: [],
    });

    const savedChat = await newChat.save();

    return res.status(201).json({ success: true, data: savedChat });
  } catch (error) {
    console.log(error);
    let errorMessage: string;
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = String(error);
    }
    return res.status(500).json({ success: false, message: errorMessage });
  }
};
