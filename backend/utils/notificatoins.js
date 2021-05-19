import User from "../models/usersModel.js";
import Notification from "../models/notificationModel.js";
import asyncHandler from "express-async-handler";

const newFollowerRequest = asyncHandler(async (userId, username, userOwnId) => {
  const userOwn = await User.findById(userOwnId);

  if (!userOwn) {
    throw new Error(`Cant't find user with id: ${userOwnId}`);
  }

  const alreadyFollowed = await userOwn.notifications.find(
    (r) => r.user.toString() === userId,
  );

  const alreadyRequested = await userOwn.following.find(
    (r) => r.user.toString() == userId,
  );

  if (alreadyFollowed || alreadyRequested) {
    throw new Error("You already submit your request or followed user");
  } else {
    const newNotification = {
      type: "newFollower",
      user: userId,
      text: "New user attep to follow you",
    };
    const userToNotify = await Notification.findOne({ user: userOwnId });
    userToNotify.notifications.push(newNotification);

    await userToNotify.save();

    return { success: true, userId, userOwnId, username };
  }
});

export { newFollowerRequest };
