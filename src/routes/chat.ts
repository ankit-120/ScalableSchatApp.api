import { Router } from "express";
import { isLoggedIn } from "../middlewares/auth";
import { getOrCreateChat } from "../controller/chat";

const router = Router();

router.post("/getOrCreateChat", isLoggedIn, getOrCreateChat);

export default router;
