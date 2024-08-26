import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/database";
import UserRoutes from "./routes/user";
import cookieParser from "cookie-parser";
import ChatRoutes from "./routes/chat";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `./src/config/.env.${env}` });

console.log(process.env.PORT);

connectDB();

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", UserRoutes);
app.use("/api/chat", ChatRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
