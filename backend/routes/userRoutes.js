import multipart from "connect-multiparty";
const multipartWare = multipart();
import express from "express";
import {
  registerUser,
  loginUser,
  followUser,
  getUserProfile,
  getUserInfo,
} from "../controllers/userControllers.js";
import { protect, admin } from "../middlewares/authMiddleWare.js";
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile").get(protect, getUserProfile);
router.route("/profile/:id").get(getUserInfo);
router.route("/follow/:id").post(protect, followUser);

export default router;
