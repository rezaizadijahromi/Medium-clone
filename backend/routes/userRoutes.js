import multipart from "connect-multiparty";
const multipartWare = multipart();
import express from "express";
import passport from "passport";

import {
  registerUser,
  loginUser,
  followUser,
  unfollowUser,
  getUserProfile,
  getUserInfo,
  updateUserProfile,
  acceptNotificationsHandler,
  getAllNotificationsHandler,
  delNotificationsHandler,
  googleLogin,
  // googleAuth,
  // googleAuthCallBack,
} from "../controllers/userControllers.js";
import { protect, admin } from "../middlewares/authMiddleWare.js";
const router = express.Router();

// router.route("/auth/google").get(googleAuth);
// router.route("/auth/google/callback").get(googleAuthCallBack);

router.route("/googlelogin").post(googleLogin);

router.route("/notif").get(protect, getAllNotificationsHandler);
router
  .route("/notif/:id")
  .post(protect, acceptNotificationsHandler)
  .delete(protect, delNotificationsHandler);

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/:id").get(protect, getUserInfo);
router
  .route("/follow/:id")
  .post(protect, followUser)
  .delete(protect, unfollowUser);

export default router;
