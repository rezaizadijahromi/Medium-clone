import multipart from "connect-multiparty";
const multipartWare = multipart();
import express from "express";
import {
  registerUser,
  loginUser,
  followUser,
  unfollowUser,
  getUserProfile,
  getUserInfo,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { protect, admin } from "../middlewares/authMiddleWare.js";
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/profile/:id").get(getUserInfo);
router
  .route("/follow/:id")
  .post(protect, followUser)
  .delete(protect, unfollowUser);

export default router;
