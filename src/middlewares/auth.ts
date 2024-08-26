import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "../schema/userSchema";

interface Decode {
  id: string;
  email: string;
}

interface AuthRequest extends Request {
  currentUser?: UserDocument | null;
}

export const isLoggedIn = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ success: false, message: "Login First" });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as Decode;
    req.currentUser = (await User.findById(decode.id)) as UserDocument;

    next();
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

export const isLoggedOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.cookies;
    if (token) {
      return res
        .status(401)
        .json({ success: false, message: "Already Loggedin" });
    }
    next();
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
