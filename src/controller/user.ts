import User from "../schema/userSchema";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    const [emailCheck, usernameCheck] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username }),
    ]);
    if (emailCheck) {
      return res.status(409).json({
        success: false,
        message: "Email already exists,please use different",
      });
    }
    if (usernameCheck) {
      return res.status(409).json({
        success: false,
        message: "Username already exists,please use different",
      });
    }

    const salt = bcrypt.genSaltSync(8);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log({ savedUser });

    const token = jwt.sign(
      { email, id: savedUser._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: 60 * 60,
      }
    );

    return res
      .status(200)
      .cookie("token", token, { maxAge: 1000 * 60 * 60, httpOnly: true })
      .json({ success: true, data: { name, username, email } });
  } catch (error: unknown) {
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

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    console.log({ user });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found, Please sign up!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password!);
    if (!checkPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Password Incorrect" });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET!,
      {
        expiresIn: 60 * 60,
      }
    );
    delete user.password;
    return res
      .status(200)
      .cookie("token", token, { maxAge: 1000 * 60 * 60, httpOnly: true })
      .json({ success: true, user });
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json({ success: true, users });
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

export const logout = (req: Request, res: Response) => {
  console.log("logout");
  return res
    .status(200)
    .cookie("token", "", { expires: new Date(Date.now()), httpOnly: true })
    .json({ success: true, message: "Logout successfull" });
};

export const getSearchedUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query as { query?: string };
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Query is required" });
    }
    const data = await User.find(
      { $or: [{ name: new RegExp(query, "i") }] },
      { password: 0 }
    );
    console.log({ data });
    return res.status(200).json({ success: true, data });
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
