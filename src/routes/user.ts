import { Router } from "express";
import {
  createUser,
  getSearchedUsers,
  login,
  logout,
} from "../controller/user";
import { isLoggedIn, isLoggedOut } from "../middlewares/auth";

const router = Router();

router.post("/signup", createUser);
router.post("/login", isLoggedOut, login);
router.post("/logout", isLoggedIn, logout);

router.get("/searchUsers", isLoggedIn, getSearchedUsers);

export default router;
