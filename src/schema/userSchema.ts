import mongoose, { Document } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export interface UserDocument extends Document {
  name: string;
  email: string;
  username: string;
  password?: string;
}

const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
