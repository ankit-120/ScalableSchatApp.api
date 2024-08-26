import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting db");
    const connect = await mongoose.connect(process.env.MONGO_URI!);
    console.log("DB connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
