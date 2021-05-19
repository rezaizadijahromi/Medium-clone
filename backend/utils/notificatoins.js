import User from "../models/usersModel.js";
import Notification from "../models/notificationModel.js";
import asyncHandler from "express-async-handler";

const newFollowerRequest = asyncHandler(
  async (userId, username, status, userOwnId) => {},
);

export { newFollowerRequest };
